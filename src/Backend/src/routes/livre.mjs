import express from "express"; // Importer le module express pour créer le routeur
import { success } from "./helper.mjs"; // Importer la fonction success pour formater les réponses
import { auth } from "../auth/auth.mjs"; // Importer le middleware d'authentification (non utilisé ici)
import { sequelize, User } from "../db/sequelize.mjs"; // Importer l'instance de Sequelize pour la connexion à la DB
import { Sequelize, Op, DataTypes } from "sequelize"; // Importer Sequelize, les opérateurs et DataTypes
import { upload } from "../middleware/uploadMiddleware.mjs";
import { privateKey } from "../auth/private_key.mjs";
import jwt from "jsonwebtoken";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// Importer les fonctions modèles depuis le module de définition des modèles
import {
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  LivreModel,
} from "../db/sequelize.mjs";
import {
  LaisserModel,
  ApprecierModel,
  defineRelations,
} from "../models/structure.mjs";

const livreRouter = express.Router(); // Créer un routeur express dédié aux routes liées aux livres

// Initialisation des modèles en appelant les fonctions modèles avec sequelize et DataTypes
const Auteur = AuteurModel(sequelize, DataTypes); // Initialiser le modèle Auteur
const Categorie = CategorieModel(sequelize, DataTypes); // Initialiser le modèle Catégorie
const Utilisateur = UtilisateurModel(sequelize, DataTypes); // Initialiser le modèle Utilisateur
const Editeur = EditeurModel(sequelize, DataTypes); // Initialiser le modèle Editeur
const Livre = LivreModel(sequelize, DataTypes); // Initialiser le modèle Livre
const Laisser = LaisserModel(sequelize, DataTypes); // Initialiser le modèle Laisser (commentaires)
const Apprecier = ApprecierModel(sequelize, DataTypes); // Initialiser le modèle Apprecier (notations)

// Définir les relations entre les modèles en passant un objet contenant tous les modèles initialisés
defineRelations({
  Auteur,
  Categorie,
  Utilisateur,
  Editeur,
  Livre,
  Laisser,
  Apprecier,
});
// Route GET pour récupérer tous les livres
livreRouter.get("/", async (req, res) => {
  try {
    // Find all books but exclude the 'livre' (EPUB) field
    const books = await Livre.findAll({
      limit: 5,
      attributes: {
        exclude: ['livre'] // Exclude the EPUB content to reduce response size
      },
      include: [
        { model: Auteur, as: "auteur" },
        { model: Categorie, as: "categorie" },
        {
          model: Utilisateur,
          as: "utilisateur",
          attributes: ["utilisateur_id", "username"],
        },
      ],
    });

    if (books.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé." });
    }

    return res.json(success("Liste des livres récupérée avec succès.", books));
  } catch (error) {
    console.error("Erreur lors de la récupération des livres :", error);
    return res.status(500).json({
      message: "Impossible de récupérer les livres.",
      data: error.message,
    });
  }
});

// Route GET for getting a specific book with its EPUB content
livreRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const book = await Livre.findByPk(id, {
      // Include all fields including 'livre' (EPUB content)
      include: [
        { model: Auteur, as: "auteur", required: false },
        { model: Categorie, as: "categorie", required: false },
        {
          model: User,
          as: "utilisateur",
          attributes: ["utilisateur_id", "username"],
          required: false,
        },
      ],
    });

    if (!book) {
      return res.status(404).json({ 
        message: "Le livre demandé n'existe pas." 
      });
    }

    return res.json(
      success(`Le livre dont l'id vaut ${id} a bien été récupéré.`, book)
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du livre :", error);
    return res.status(500).json({
      message: "Le livre n'a pas pu être récupéré.",
      data: error.message,
    });
  }
});

livreRouter.post(
  "/",
  auth,
  upload.single("imageCouverture"),
  async (req, res) => {
    // Récupérer le token depuis les cookies
    const token = req.cookies?.token;

    // Extraction des données du livre depuis le corps de la requête
    const { titre, auteur, categorie, anneeEdition, nbPage, resume } = req.body;
    const imageCouverturePath = req.file
      ? `/uploads/${req.file.filename}` // Chemin de l'image, si fournie
      : null;

    try {
      // Décodage du token JWT
      const decoded = jwt.verify(token, privateKey);
      const utilisateur_fk = decoded.userId;

      // Vérifier si l'auteur existe dans la DB, sinon le créer
      let auteurData = await Auteur.findOne({ where: { nom: auteur } });
      if (!auteurData) {
        auteurData = await Auteur.create({ nom: auteur });
      }

      // Vérifier si la catégorie existe dans la DB, sinon la créer
      let categorieData = await Categorie.findOne({
        where: { libelle: categorie },
      });
      if (!categorieData) {
        categorieData = await Categorie.create({ libelle: categorie });
      }

      // Vérifier si un livre similaire existe déjà
      const existingBooks = await Livre.findAll({
        where: {
          titre: { [Op.like]: `%${titre}%` },
          auteur_fk: auteurData.auteur_id,
          categorie_fk: categorieData.categorie_id,
        },
      });

      if (existingBooks.length > 0) {
        return res.json(
          success(
            "Voici les livres correspondant à votre recherche :",
            existingBooks
          )
        );
      }

      // Créer le nouveau livre dans la DB
      const book = await Livre.create({
        titre,
        auteur_fk: auteurData.auteur_id,
        categorie_fk: categorieData.categorie_id,
        utilisateur_fk, // Ajout du FK depuis le token
        anneeEdition,
        nbPage,
        imageCouverturePath,
        resume,
      });

      // Retourner le livre créé avec un message de succès
      return res.json(
        success(`Le livre "${book.titre}" a bien été créé.`, book)
      );
    } catch (error) {
      console.error("Erreur lors de la création du livre :", error);
      return res.status(500).json({
        message: "Le livre n'a pas pu être ajouté.",
        data: error.message,
      });
    }
  }
);

// Route PUT pour modifier un livre par ID
livreRouter.put("/:id", auth, async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Livre.findByPk(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    const utilisateur = await Utilisateur.findByPk(req.userId);
    if (
      !utilisateur ||
      (book.utilisateur_fk !== req.userId && !utilisateur.isAdmin)
    ) {
      return res
        .status(403)
        .json({ message: "Vous n'avez pas le droit de modifier ce livre." });
    }

    if (req.body.auteur) {
      let auteurData = await Auteur.findOne({
        where: { nom: req.body.auteur },
      });
      if (!auteurData) {
        auteurData = await Auteur.create({ nom: req.body.auteur });
      }
      req.body.auteur_fk = auteurData.auteur_id;
      delete req.body.auteur;
    }

    if (req.body.categorie) {
      let categorieData = await Categorie.findOne({
        where: { libelle: req.body.categorie },
      });
      if (!categorieData) {
        categorieData = await Categorie.create({ libelle: req.body.categorie });
      }
      req.body.categorie_fk = categorieData.categorie_id;
      delete req.body.categorie;
    }

    await Livre.update(req.body, { where: { livre_id: bookId } });

    const updatedBook = await Livre.findByPk(bookId, {
      include: [
        { model: Auteur, as: "auteur", required: false },
        { model: Categorie, as: "categorie", required: false },
      ],
    });

    return res.json(
      success(
        `Le livre "${updatedBook.titre}" a été mis à jour avec succès.`,
        updatedBook
      )
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du livre :", error);
    return res.status(500).json({
      message: "Le livre n'a pas pu être mis à jour.",
      data: error.message,
    });
  }
});

livreRouter.delete("/:id", auth, async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Livre.findByPk(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    const utilisateur = await Utilisateur.findByPk(req.userId);
    if (
      !utilisateur ||
      (book.utilisateur_fk !== req.userId && !utilisateur.isAdmin)
    ) {
      return res
        .status(403)
        .json({ message: "Vous n'avez pas le droit de supprimer ce livre." });
    }

    await Apprecier.destroy({ where: { livre_fk: book.livre_id } });
    await Livre.destroy({ where: { livre_id: bookId } });

    return res.json(
      success(`Le livre "${book.titre}" a bien été supprimé !`, book)
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Le livre n'a pas pu être supprimé.", data: error });
  }
});

/////////////////////////////////// ROUTES COMMENT //////////////////////////////////////

livreRouter.post("/:id/comments", auth, async (req, res) => {
  const { content } = req.body; // on attend "content" comme côté frontend
  const utilisateur_id = req.userId; // injecté par le middleware auth

  if (!content || !utilisateur_id) {
    return res.status(400).json({ message: "Le contenu est requis." });
  }

  try {
    const livreId = parseInt(req.params.id, 10);
    const book = await Livre.findByPk(livreId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    const newComment = await Laisser.create({
      livre_fk: livreId,
      utilisateur_fk: utilisateur_id,
      contenu: content,
    });

    // recharge avec l'inclusion du username
    const commentWithUser = await Laisser.findByPk(newComment.id, {
      include: {
        model: Utilisateur,
        attributes: ["username"],
      },
    });

    return res.status(201).json({
      message: "Commentaire ajouté avec succès.",
      comment: commentWithUser,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    return res.status(500).json({
      message: "Le commentaire n'a pas pu être ajouté.",
      error: error.message,
    });
  }
});

livreRouter.get("/:id/comments", async (req, res) => {
  const livreId = parseInt(req.params.id, 10);

  try {
    const book = await Livre.findByPk(livreId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    const comments = await Laisser.findAll({
      where: { livre_fk: livreId },
      include: [
        {
          model: Utilisateur,
          attributes: ["username"],
        },
      ],
    });

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun commentaire trouvé pour ce livre." });
    }

    return res.status(200).json({
      message: `Commentaires pour le livre avec l'ID ${livreId}`,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des commentaires.",
      error: error.message,
    });
  }
});

////////////////////////////////// ROUTES NOTES //////////////////////////////////////
livreRouter.get("/:id/notes", async (req, res) => {
  const livreId = parseInt(req.params.id, 10);

  try {
    const book = await Livre.findByPk(livreId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    const ratings = await Apprecier.findAll({
      where: { livre_fk: livreId },
      include: [
        {
          model: Utilisateur,
          attributes: ["username"],
        },
      ],
    });

    if (ratings.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune note trouvée pour ce livre." });
    }

    return res.status(200).json({
      message: `Notes pour le livre avec l'ID ${livreId}`,
      ratings,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des notes.",
      error: error.message,
    });
  }
});

livreRouter.post("/:id/notes", auth, async (req, res) => {
  const { note, utilisateur_id, livre_id } = req.body;

  if (
    note === undefined ||
    utilisateur_id === undefined ||
    livre_id === undefined
  ) {
    return res.status(400).json({
      message: "La note, utilisateur_id et livre_id sont nécessaires.",
    });
  }

  try {
    const book = await Livre.findByPk(livre_id);
    if (!book) {
      return res.status(404).json({ message: "Le livre n'existe pas." });
    }

    const user = await Utilisateur.findByPk(utilisateur_id);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé." });
    }

    const existing = await Apprecier.findOne({
      where: {
        livre_fk: livre_id,
        utilisateur_fk: utilisateur_id,
      },
    });

    if (existing) {
      existing.note = note;
      await existing.save();
      return res.status(200).json({
        message: "Note mise à jour avec succès.",
        rating: existing,
      });
    }

    const newRating = await Apprecier.create({
      livre_fk: livre_id,
      utilisateur_fk: utilisateur_id,
      note: note,
    });

    return res.status(201).json({
      message: "Note ajoutée avec succès.",
      rating: newRating,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'enregistrement de la note.",
      error: error.message,
    });
  }
});

livreRouter.get("/:id/notes/:utilisateur_id", async (req, res) => {
  const livreId = parseInt(req.params.id, 10);
  const utilisateurId = parseInt(req.params.utilisateur_id, 10);

  try {
    const rating = await Apprecier.findOne({
      where: {
        livre_fk: livreId,
        utilisateur_fk: utilisateurId,
      },
    });

    if (!rating) {
      return res.status(404).json({ note: null });
    }

    return res.json({ note: rating.note });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de la note utilisateur.",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /livres:
 *   post:
 *     summary: Créer un nouveau livre
 *     description: Ajoute un nouveau livre à la bibliothèque.
 *     operationId: createBook
 *     tags:
 *       - Livres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *                 description: Le titre du livre
 *                 example: "Gatsby le Magnifique"
 *               auteur:
 *                 type: string
 *                 description: L'auteur du livre
 *                 example: "F. Scott Fitzgerald"
 *               categorie:
 *                 type: string
 *                 description: La catégorie du livre
 *                 example: "Littérature"
 *               anneeEdition:
 *                 type: integer
 *                 description: L'année de publication du livre
 *                 example: 1925
 *               nbPage:
 *                 type: integer
 *                 description: Le nombre de pages du livre
 *                 example: 218
 *               imageCouverturePath:
 *                 type: string
 *                 description: Le chemin de l'image de couverture du livre
 *                 example: "/uploads/1634108505370.jpg"
 *               resume:
 *                 type: string
 *                 description: Un résumé du livre
 *                 example: "Un roman racontant l'histoire de Jay Gatsby, un homme mystérieux et riche."
 *     responses:
 *       200:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 titre:
 *                   type: string
 *                   example: "Gatsby le Magnifique"
 *                 auteur:
 *                   type: string
 *                   example: "F. Scott Fitzgerald"
 *                 categorie:
 *                   type: string
 *                   example: "Littérature"
 */

export { livreRouter }; // Exporter le routeur pour qu'il soit utilisé dans l'application principale

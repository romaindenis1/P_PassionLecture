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
    // Rechercher tous les livres en incluant les associations Auteur et Catégorie
    const books = await Livre.findAll({
      limit: 5,
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

    // Si aucun livre n'est trouvé, retourner une réponse 404
    if (books.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé." });
    }

    // Retourner la liste des livres avec un message de succès
    return res.json(success("Liste des livres récupérée avec succès.", books));
  } catch (error) {
    // En cas d'erreur, l'afficher dans la console et retourner une réponse 500 avec le message d'erreur
    console.error("Erreur lors de la récupération des livres :", error);
    return res.status(500).json({
      message: "Impossible de récupérer les livres.",
      data: error.message,
    });
  }
});

// Route GET pour récupérer un livre spécifique par ID
livreRouter.get("/:id", async (req, res) => {
  try {
    // Convertir l'ID reçu en entier
    const id = parseInt(req.params.id, 10);
    // Rechercher le livre par clé primaire en incluant les associations Auteur et Catégorie (non obligatoires)
    const book = await Livre.findByPk(id, {
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

    // Si le livre n'est pas trouvé, retourner une réponse 404
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    // Retourner le livre trouvé avec un message de succès
    return res.json(
      success(`Le livre dont l'id vaut ${id} a bien été récupéré.`, book)
    );
  } catch (error) {
    // En cas d'erreur, l'afficher dans la console et retourner une réponse 500 avec le message d'erreur
    console.error("Erreur lors de la récupération du livre :", error);
    return res.status(500).json({
      message: "Le livre n'a pas pu être récupéré.",
      data: error.message,
    });
  }
});


livreRouter.post(
  "/",
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
  const bookId = req.params.id; // Récupérer l'ID du livre à modifier depuis l'URL

  try {
    // Vérifier si le livre existe
    const book = await Livre.findByPk(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    if (req.body.auteur) {
      let auteurData = await Auteur.findOne({
        where: { nom: req.body.auteur },
      });
      if (!auteurData) {
        // Créer l'auteur si non existant. Note : le modèle Auteur ne contient que "nom"
        auteurData = await Auteur.create({ nom: req.body.auteur });
      }
      req.body.auteur_fk = auteurData.auteur_id; // Affecter la clé étrangère
      delete req.body.auteur; // Supprimer le champ auteur du body
    }

    if (req.body.categorie) {
      let categorieData = await Categorie.findOne({
        where: { libelle: req.body.categorie },
      });
      if (!categorieData) {
        // Créer la catégorie si elle n'existe pas
        categorieData = await Categorie.create({ libelle: req.body.categorie });
      }
      req.body.categorie_fk = categorieData.categorie_id; // Affecter la clé étrangère
      delete req.body.categorie; // Supprimer le champ categorie du body
    }

    // Mettre à jour le livre avec les données fournies
    await Livre.update(req.body, { where: { livre_id: bookId } });

    // Récupérer le livre mis à jour en incluant les associations
    const updatedBook = await Livre.findByPk(bookId, {
      include: [
        { model: Auteur, as: "auteur", required: false },
        { model: Categorie, required: false },
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

// Route DELETE pour supprimer un livre par ID
livreRouter.delete("/:id", auth, async (req, res) => {
  try {
    // Rechercher le livre à supprimer par sa clé primaire
    const book = await Livre.findByPk(req.params.id);

    // Si le livre n'existe pas, retourner une réponse 404
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    // Supprimer les enregistrements dépendants dans t_apprecier
    await Apprecier.destroy({ where: { livre_fk: book.livre_id } });

    // Supprimer le livre en utilisant sa clé primaire
    await Livre.destroy({ where: { livre_id: req.params.id } });

    // Retourner une réponse de succès avec le livre supprimé
    return res.json(
      success(`Le livre "${book.titre}" a bien été supprimé !`, book)
    );
  } catch (error) {
    // En cas d'erreur lors de la suppression, retourner une réponse 500 avec le message d'erreur
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
      return res
        .status(404)
        .json({ message: "Le livre demandé n'existe pas." });
    }

    const user = await Utilisateur.findByPk(utilisateur_id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "L'utilisateur spécifié n'existe pas." });
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
      message: "La note n'a pas pu être ajoutée.",
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

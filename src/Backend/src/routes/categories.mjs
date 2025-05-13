import express from "express"; // Importer Express pour créer le routeur
import { sequelize } from "../db/sequelize.mjs"; // Importer l'instance Sequelize
import { Sequelize, Op, DataTypes } from "sequelize"; // Importer Sequelize et ses outils

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

const categorieRouter = express.Router(); // Créer le routeur pour les catégories

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
// GET / - Récupérer toutes les catégories
categorieRouter.get("/", async (req, res) => {
  try {
    const categories = await Categorie.findAll(); // Récupère toutes les catégories

    // Si aucune catégorie n'est trouvée, renvoyer un 404
    if (!categories || categories.length === 0) {
      const message = "Aucune catégorie trouvée.";
      return res.status(404).json({ message });
    }

    // Renvoi avec un message de succès
    const message = `${categories.length} catégorie(s) ont été récupérée(s).`;
    return res.json({ message, categories });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse 500
    const message =
      "Les catégories n'ont pas pu être récupérées. Merci de réessayer dans quelques instants.";
    console.error(error);
    return res.status(500).json({ message, data: error });
  }
});

// GET /:id/livres - Récupérer les livres d'une catégorie donnée
categorieRouter.get("/:id/livres", async (req, res) => {
  try {
    const { id } = req.params; // Extraire l'ID de la catégorie
    // Chercher les livres ayant cette catégorie (clé étrangère)
    const books = await Livre.findAll({
      where: { categorie_fk: id },
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

    // Si aucun livre n'est trouvé, renvoyer un 404
    if (!books || books.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun livre trouvé pour cette catégorie." });
    }

    // Renvoi des livres avec un message de succès
    const message = `${books.length} livre(s) trouvés pour la catégorie d'id ${id}.`;
    return res.json({ message, books });
  } catch (error) {
    // En cas d'erreur, renvoyer un 500 avec le message d'erreur
    console.error(error);
    const message =
      "Les livres de la catégorie n'ont pas pu être récupérés. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});

// GET /:id - Récupérer une catégorie spécifique par son ID
categorieRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extraire l'ID de la catégorie
    // Rechercher la catégorie par son ID
    const category = await Categorie.findOne({ where: { categorie_id: id } });

    // Si la catégorie n'existe pas, renvoyer un 404
    if (!category) {
      const message = "Catégorie non trouvée.";
      return res.status(404).json({ message });
    }

    // Renvoi de la catégorie avec un message de succès
    const message = `La catégorie avec l'id ${id} a été récupérée.`;
    return res.json({ message, category });
  } catch (error) {
    // En cas d'erreur, renvoyer un 500 avec le message d'erreur
    const message =
      "La catégorie n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    console.error(error);
    return res.status(500).json({ message, data: error });
  }
});

export { categorieRouter }; // Exporter le routeur pour l'utiliser dans l'application

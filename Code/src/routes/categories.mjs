import express from 'express'; // Importer le module express pour créer le routeur
import { CategorieModel } from '../models/structure.mjs'; // Importer la fonction de création du modèle Catégorie
import { sequelize } from "../db/sequelize.mjs"; // Importer l'instance Sequelize pour la connexion à la base de données
import { Sequelize, Op, DataTypes } from "sequelize"; // Importer Sequelize, les opérateurs et DataTypes

const categorieRouter = express.Router(); // Créer un routeur Express pour les routes liées aux catégories

// Initialiser le modèle Catégorie en appelant la fonction CategorieModel avec sequelize et DataTypes
const Categorie = CategorieModel(sequelize, DataTypes);

// Route GET pour récupérer toutes les catégories
categorieRouter.get('/', async (req, res) => {
  try {
    // Récupérer toutes les catégories depuis la base de données
    const categories = await Categorie.findAll();
    console.log(categories); // Afficher les catégories dans la console pour débogage

    // Si aucune catégorie n'est trouvée, retourner une réponse 404 avec un message approprié
    if (!categories || categories.length === 0) {
      const message = "Aucune catégorie trouvée.";
      return res.status(404).json({ message });
    }

    // Construire un message indiquant le nombre de catégories récupérées
    const message = `${categories.length} catégorie(s) ont été récupérée(s).`;
    // Retourner les catégories avec le message de succès
    return res.json({ message, categories });

  } catch (error) {
    // En cas d'erreur, construire un message d'erreur et retourner une réponse 500
    const message = "Les catégories n'ont pas pu être récupérées. Merci de réessayer dans quelques instants.";
    console.error(error); // Afficher l'erreur dans la console
    return res.status(500).json({ message, data: error });
  }
});

// Route GET pour récupérer une catégorie spécifique par ID
categorieRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extraire l'ID de la catégorie depuis les paramètres de l'URL

    // Rechercher la catégorie dont la clé primaire correspond à l'ID fourni
    const category = await Categorie.findOne({ where: { categorie_id: id } });

    // Si la catégorie n'est pas trouvée, retourner une réponse 404
    if (!category) {
      const message = "Catégorie non trouvée.";
      return res.status(404).json({ message });
    }

    // Construire un message de succès incluant l'ID de la catégorie récupérée
    const message = `La catégorie avec l'id ${id} a été récupérée.`;
    // Retourner la catégorie avec le message de succès
    return res.json({ message, category });

  } catch (error) {
    // En cas d'erreur, construire un message d'erreur et retourner une réponse 500
    const message = "La catégorie n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    console.error(error); // Afficher l'erreur dans la console
    return res.status(500).json({ message, data: error });
  }
});

export { categorieRouter }; // Exporter le routeur pour qu'il soit utilisé dans l'application principale

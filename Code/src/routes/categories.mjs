import express from 'express'; // Importer express pour créer le routeur
import { CategorieModel, LivreModel } from '../models/structure.mjs'; // Importer les fonctions modèles pour Catégorie et Livre
import { sequelize } from "../db/sequelize.mjs"; // Importer l'instance Sequelize pour la connexion à la DB
import { Sequelize, Op, DataTypes } from "sequelize"; // Importer Sequelize, les opérateurs et DataTypes

const categorieRouter = express.Router(); // Créer un routeur pour les catégories

// Initialiser le modèle Catégorie avec sequelize et DataTypes
const Categorie = CategorieModel(sequelize, DataTypes);
// Initialiser le modèle Livre avec sequelize et DataTypes
const Livre = LivreModel(sequelize, DataTypes);

// Route GET pour récupérer toutes les catégories
categorieRouter.get('/', async (req, res) => {
  try {
    // Récupérer toutes les catégories depuis la base de données
    const categories = await Categorie.findAll();
    console.log(categories); // Afficher les catégories pour le débogage

    // Si aucune catégorie n'est trouvée, retourner une réponse 404
    if (!categories || categories.length === 0) {
      const message = "Aucune catégorie trouvée.";
      return res.status(404).json({ message });
    }

    // Construire un message indiquant le nombre de catégories récupérées et retourner la réponse
    const message = `${categories.length} catégorie(s) ont été récupérée(s).`;
    return res.json({ message, categories });
  } catch (error) {
    // En cas d'erreur, retourner une réponse 500 avec un message d'erreur
    const message = "Les catégories n'ont pas pu être récupérées. Merci de réessayer dans quelques instants.";
    console.error(error);
    return res.status(500).json({ message, data: error });
  }
});

// Nouvelle route GET pour récupérer tous les livres d'une catégorie donnée par son ID
categorieRouter.get('/:id/livres', async (req, res) => {
  try {
    const { id } = req.params; // Extraire l'ID de la catégorie depuis l'URL
    // Rechercher tous les livres dont la clé étrangère categorie_fk correspond à l'ID fourni
    const books = await Livre.findAll({ where: { categorie_fk: id } });
    
    // Si aucun livre n'est trouvé pour cette catégorie, retourner une réponse 404
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé pour cette catégorie." });
    }
    
    // Construire un message indiquant le nombre de livres trouvés et retourner la réponse
    const message = `${books.length} livre(s) trouvés pour la catégorie d'id ${id}.`;
    return res.json({ message, books });
  } catch (error) {
    // En cas d'erreur, retourner une réponse 500 avec un message d'erreur
    console.error(error);
    const message = "Les livres de la catégorie n'ont pas pu être récupérés. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});

// Route GET pour récupérer une catégorie spécifique par ID
categorieRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extraire l'ID de la catégorie depuis l'URL

    // Rechercher la catégorie dont la clé primaire correspond à l'ID fourni
    const category = await Categorie.findOne({ where: { categorie_id: id } });

    // Si la catégorie n'est pas trouvée, retourner une réponse 404
    if (!category) {
      const message = "Catégorie non trouvée.";
      return res.status(404).json({ message });
    }

    // Construire un message de succès et retourner la catégorie
    const message = `La catégorie avec l'id ${id} a été récupérée.`;
    return res.json({ message, category });
  } catch (error) {
    // En cas d'erreur, retourner une réponse 500 avec un message d'erreur
    const message = "La catégorie n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    console.error(error);
    return res.status(500).json({ message, data: error });
  }
});

export { categorieRouter }; // Exporter le routeur pour utilisation dans l'application principale

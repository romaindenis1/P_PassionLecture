import express from 'express';
import { CategorieModel } from '../models/structure.mjs';
import { sequelize } from "../db/sequelize.mjs";
import { Sequelize, Op, DataTypes } from "sequelize";
const categorieRouter = express.Router();

const Categorie = CategorieModel(sequelize, DataTypes);

//Prendre toutes les categories 
categorieRouter.get('/', async (req, res) => {
  try {

    const categories = await Categorie.findAll();
    console.log(categories);
    if (!categories || categories.length === 0) {
      const message = "Aucune catégorie trouvée.";
      return res.status(404).json({ message });
    }

    const message = `${categories.length} catégorie(s) ont été récupérée(s).`;
    return res.json({ message, categories });

  } catch (error) {

    const message = "Les catégories n'ont pas pu être récupérées. Merci de réessayer dans quelques instants.";
    console.error(error); 
    return res.status(500).json({ message, data: error });
  }
});

categorieRouter.get('/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get the category id from the request parameters
  
      // Find the category by its id, but use the correct column name (categorie_id)
      const category = await Categorie.findOne({ where: { categorie_id: id } });
  
      if (!category) {
        const message = "Catégorie non trouvée.";
        return res.status(404).json({ message });
      }
  
      const message = `La catégorie avec l'id ${id} a été récupérée.`;
      return res.json({ message, category });
  
    } catch (error) {
      const message = "La catégorie n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      console.error(error);
      return res.status(500).json({ message, data: error });
    }
  });

export { categorieRouter };

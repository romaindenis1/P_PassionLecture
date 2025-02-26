import express from "express";


import { success } from "./helper.mjs";
import { getUniqueId } from "./helper.mjs";
import { livres } from "../db/sequelize.mjs";
import { ValidationError } from "sequelize";
import { auth } from "../auth/auth.mjs";
import { sequelize } from "../db/sequelize.mjs";
import { Sequelize, Op, DataTypes } from "sequelize";  

import { AuteurModel } from "../db/sequelize.mjs";
import { CategorieModel } from "../db/sequelize.mjs";
import { UtilisateurModel } from "../db/sequelize.mjs";
import { EditeurModel } from "../db/sequelize.mjs";
import { LivreModel } from "../db/sequelize.mjs";
import { LaisserModel } from "../models/structure.mjs";
import { ApprecierModel } from "../models/structure.mjs";

import { defineRelations } from "../models/structure.mjs";


const livreRouter = express();


// Initialize models
const Auteur = AuteurModel(sequelize, DataTypes);
const Categorie = CategorieModel(sequelize, DataTypes);
const Utilisateur = UtilisateurModel(sequelize, DataTypes);
const Editeur = EditeurModel(sequelize, DataTypes);
const Livre = LivreModel(sequelize, DataTypes);
const Laisser = LaisserModel(sequelize, DataTypes);
const Apprecier = ApprecierModel(sequelize, DataTypes);

// Define relationships between models
defineRelations({
  Auteur,
  Categorie,
  Utilisateur,
  Editeur,
  Livre,
  Laisser,
  Apprecier
});

// Get a specific book by ID
livreRouter.get("/:id", async (req, res) => {
  try {
    const book = await Livre.findByPk(req.params.id, {
      include: [
        { model: Auteur, required: true },
        { model: Categorie, required: true }
      ]
    });

    if (!book) {
      const message = "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }

    const message = `Le livre dont l'id vaut ${book.livre_id} a bien été récupéré.`;
    return res.json(success(message, book));

  } catch (error) {
    const message = "Le livre n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});

// Create a new book
livreRouter.post("/", async (req, res) => {
  const { titre, auteur, categorie, anneeEdition, id } = req.body;

  // Prepare search conditions for querying
  const whereConditions = {};

  if (id) whereConditions.livre_id = id;
  if (titre) whereConditions.titre = { [Op.iLike]: `%${titre}%` };
  if (auteur) whereConditions['$Auteur.nom$'] = { [Op.iLike]: `%${auteur}%` };
  if (categorie) whereConditions['$Categorie.libelle$'] = { [Op.iLike]: `%${categorie}%` };
  if (anneeEdition) whereConditions.anneeEdition = anneeEdition;

  try {
    //Check si livre existe
    const existingBooks = await Livre.findAll({
      where: whereConditions,
      include: [
        { model: Auteur, required: true },
        { model: Categorie, required: true }
      ]
    });

    if (existingBooks.length > 0) {
      return res.json(success("Voici les livres correspondant à votre recherche:", existingBooks));
    }

    //Creer
    const book = await Livre.create(req.body);
    const message = `Le livre dont le nom est ${book.titre} a bien été créé.`;
    return res.json(success(message, book));

  } catch (error) {
    const message = "Le livre n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});

//Patch par id
livreRouter.put("/:id", auth, async (req, res) => {
  const bookId = req.params.id;

  try {
    const [updated] = await Livre.update(req.body, { where: { livre_id: bookId } });

    if (updated === 0) {
      const message = "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }

    const updatedBook = await Livre.findByPk(bookId, {
      include: [
        { model: Auteur, required: true },
        { model: Categorie, required: true }
      ]
    });

    const message = `Le livre ${updatedBook.titre} dont l'id vaut ${updatedBook.livre_id} a été mis à jour avec succès.`;
    return res.json(success(message, updatedBook));

  } catch (error) {
    const message = "Le livre n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});

//Suprimmer par id
livreRouter.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Livre.findByPk(req.params.id);

    if (!book) {
      const message = "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }

    await Livre.destroy({
      where: { livre_id: req.params.id }
    });

    const message = `Le livre ${book.titre} a bien été supprimé !`;
    return res.json(success(message, book));

  } catch (error) {
    const message = "Le livre n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});



export { livreRouter };
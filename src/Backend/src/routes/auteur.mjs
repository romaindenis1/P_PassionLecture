import express from "express";
import { sequelize } from "../db/sequelize.mjs";
import { Sequelize, Op, DataTypes } from "sequelize";
import { AuteurModel, LivreModel } from "../db/sequelize.mjs";
// Création des modèles Auteur et Livre à partir de Sequelize
const Auteur = AuteurModel(sequelize, DataTypes);
const Livre = LivreModel(sequelize, DataTypes);

// Création d'un routeur Express pour les auteurs
const auteurRouter = express.Router();

// GET /auteurs - Récupérer tous les auteurs, avec filtre optionnel sur id et nom
auteurRouter.get("/", async (req, res) => {
  try {
    const { id, nom } = req.query; // Récupérer les filtres éventuels
    const whereClause = {};

    if (id) whereClause.auteur_id = id;
    if (nom) whereClause.nom = nom;

    // Recherche des auteurs avec le filtre appliqué
    const auteurs = await Auteur.findAll({ where: whereClause });

    // Si aucun auteur n'est trouvé, renvoyer une erreur 404
    if (auteurs.length === 0) {
      return res.status(404).json({ message: "Aucun auteur trouvé." });
    }

    // Renvoi des auteurs trouvés
    res.json({
      message: "Auteurs récupérés avec succès.",
      data: auteurs,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des auteurs :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

// GET /auteurs/:id/livres - Récupérer les livres d'un auteur donné
auteurRouter.get("/:id/livres", async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifie que l'ID est bien un nombre
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID d'auteur invalide." });
    }

    // Recherche de l'auteur et inclusion de ses livres via l'association "livres"
    const auteur = await Auteur.findByPk(id, {
      include: [{ model: Livre, as: "livres" }],
    });

    if (!auteur) {
      return res.status(404).json({ message: "Auteur non trouvé." });
    }

    // Vérifie si l'auteur possède des livres
    if (!auteur.livres || auteur.livres.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun livre trouvé pour cet auteur." });
    }

    // Renvoie des livres de l'auteur
    return res.status(200).json({
      message: "Livres récupérés avec succès.",
      data: auteur.livres,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des livres de l'auteur :",
      error
    );
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des livres.",
      error: error.message,
    });
  }
});

// GET /getAuthorIdByName?nom=NomAuteur
auteurRouter.get("/getAuthorIdByName", async (req, res) => {
  const { nom } = req.query;
  if (!nom) {
    return res.status(400).json({ message: "Le nom de l'auteur est requis." });
  }
  try {
    const auteur = await Auteur.findOne({ where: { nom } });
    if (!auteur) {
      return res.status(404).json({ message: "Auteur non trouvé." });
    }
    return res.json({ auteur_id: auteur.auteur_id });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
});

// POST /auteurs - Créer un nouvel auteur
auteurRouter.post("/", async (req, res) => {
  const { nom } = req.body;
  if (!nom) {
    return res.status(400).json({ message: "Le nom de l'auteur est requis." });
  }
  try {
    // Vérifie si l'auteur existe déjà
    const existing = await Auteur.findOne({ where: { nom } });
    if (existing) {
      return res.status(409).json({ message: "Auteur déjà existant." });
    }
    const auteur = await Auteur.create({ nom });
    return res
      .status(201)
      .json({ message: "Auteur créé avec succès.", data: auteur });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Export du routeur pour l'utiliser dans l'application
export { auteurRouter };

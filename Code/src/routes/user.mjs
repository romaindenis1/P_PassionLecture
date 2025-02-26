import express from "express";
import bcrypt from "bcrypt";
import { User } from "../db/sequelize.mjs";

const userRouter = express.Router();

// Récupérer les utilisateurs (filtrable par ID ou username)
userRouter.get("/", async (req, res) => {
  try {
    const { id, username } = req.query;
    const whereClause = {};

    if (id) whereClause.utilisateur_id = id;
    if (username) whereClause.username = username;

    const users = await User.findAll({
      where: whereClause,
      attributes: ["utilisateur_id", "username", "dateSignup", "isAdmin"],
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    res.json({
      message: "Utilisateur(s) trouvé(s).",
      data: users,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

// Mise à jour d'un utilisateur uniquement par ID
userRouter.put("/", async (req, res) => {
  try {
    const { id, username, password } = req.body;

    if (!id) {
      return res.status(400).json({ message: "L'ID de l'utilisateur est requis pour la mise à jour." });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (username) user.username = username;
    if (password) user.hashedPassword = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: "Utilisateur mis à jour avec succès.", data: user });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

// Suppression d'un utilisateur par ID ou username
userRouter.delete("/", async (req, res) => {
  try {
    const { id, username } = req.query;

    if (!id && !username) {
      return res.status(400).json({ message: "Un ID ou un username est requis pour la suppression." });
    }

    const whereClause = id ? { utilisateur_id: id } : { username };
    const user = await User.findOne({ where: whereClause });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    await user.destroy();
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

export { userRouter };

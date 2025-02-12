import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs"; // Verif si chemin correct
import { privateKey } from "../auth/private_key.mjs";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur demandé n'existe pas" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Le mot de passe est incorrect." });
    }

    // Génération du token JWT
    const token = jwt.sign({ userId: user.id }, privateKey, { expiresIn: "1y" });

    return res.json({
      message: "L'utilisateur a été connecté avec succès",
      data: { id: user.id, username: user.username }, 
      token
    });

  } catch (error) {
    console.error("Erreur de connexion :", error);
    return res.status(500).json({ message: "Une erreur est survenue lors de la connexion.", error: error.message });
  }
});

export { loginRouter };

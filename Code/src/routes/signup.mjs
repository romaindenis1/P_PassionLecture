import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs"; // Verif si chemin correct
import { privateKey } from "../auth/private_key.mjs";
import { ValidationError, Op } from "sequelize";
 
const signupRouter = express();
 
// Création d'un utilisateur
signupRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
 
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "Ce username est déjà utilisé." });
    }
 
    // Hacher le mot de passe avant l'enregistrement
    const hashedPassword = await bcrypt.hash(password, 10);
 
    // Création de l'utilisateur avec les valeurs par défaut
    const newUser = await User.create({
      username,
      hashedPassword,
      dateSignup: new Date(), // Valeur par défaut
      isAdmin: false, // Valeur par défaut
    });
 
    const message = `L'utilisateur ${newUser.username} a bien été créé !`;
    res.status(201).json({ message, data: newUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Une erreur est survenue", error });
  }
});
 
export { signupRouter };
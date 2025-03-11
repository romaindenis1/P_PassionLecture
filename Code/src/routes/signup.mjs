import express from "express"; // Importer Express pour créer le routeur
import bcrypt from "bcrypt"; // Importer bcrypt pour hacher le mot de passe
import { User } from "../db/sequelize.mjs"; // Importer le modèle User
import { ValidationError, Op } from "sequelize"; // Importer ValidationError et Op

const signupRouter = express(); // Créer une instance d'Express pour l'inscription

// Endpoint POST pour créer un nouvel utilisateur (inscription)
signupRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body; // Extraire username et password du corps de la requête

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      // Si trouvé, renvoyer un statut 409 (conflit)
      return res.status(409).json({ message: "Ce username est déjà utilisé." });
    }

    // Hacher le mot de passe avec bcrypt (salt de 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec la date actuelle et isAdmin à false
    const newUser = await User.create({
      username,
      hashedPassword,
      dateSignup: new Date(),
      isAdmin: false,
    });

    // Message de succès et réponse avec statut 201 (créé)
    const message = `L'utilisateur ${newUser.username} a bien été créé !`;
    res.status(201).json({ message, data: newUser });
  } catch (error) {
    // Si l'erreur est une ValidationError, renvoyer une 400 (mauvaise requête)
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Une erreur est survenue", error });
  }
});

export { signupRouter }; // Exporter le routeur d'inscription

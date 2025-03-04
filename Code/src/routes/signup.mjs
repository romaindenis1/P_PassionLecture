import express from "express"; // Importer le module Express pour créer le routeur
import bcrypt from "bcrypt"; // Importer bcrypt pour le hachage des mots de passe
import jwt from "jsonwebtoken"; // Importer jsonwebtoken pour créer des tokens JWT (non utilisé ici)
import { User } from "../db/sequelize.mjs"; // Importer le modèle User depuis la configuration Sequelize (vérifier le chemin)
import { privateKey } from "../auth/private_key.mjs"; // Importer la clé privée pour signer les tokens (non utilisé dans cet endpoint)
import { ValidationError, Op } from "sequelize"; // Importer ValidationError et Op depuis Sequelize

const signupRouter = express(); // Créer une instance d'Express pour le routeur d'inscription

// Création d'un utilisateur (endpoint d'inscription)
signupRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body; // Extraire le username et le password du corps de la requête

    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      // Si l'utilisateur existe, retourner un statut 409 avec un message d'erreur
      return res.status(409).json({ message: "Ce username est déjà utilisé." });
    }

    // Hacher le mot de passe en utilisant bcrypt avec un salt de 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec les valeurs par défaut pour dateSignup et isAdmin
    const newUser = await User.create({
      username,
      hashedPassword,
      dateSignup: new Date(), // Date d'inscription définie à la date actuelle
      isAdmin: false // Valeur par défaut indiquant que l'utilisateur n'est pas administrateur
    });

    // Préparer un message de succès incluant le username du nouvel utilisateur
    const message = `L'utilisateur ${newUser.username} a bien été créé !`;
    // Retourner une réponse avec le statut 201 et les données du nouvel utilisateur
    res.status(201).json({ message, data: newUser });
  } catch (error) {
    // Si l'erreur est une ValidationError, retourner une réponse 400 avec le message d'erreur
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }
    // Afficher l'erreur dans la console pour le débogage
    console.error("Erreur lors de l'inscription :", error);
    // Retourner une réponse 500 avec un message générique et les détails de l'erreur
    res.status(500).json({ message: "Une erreur est survenue", error });
  }
});

export { signupRouter }; // Exporter le routeur d'inscription pour l'utiliser dans l'application principale

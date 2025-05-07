import express from "express"; // Importer Express pour créer l'API
import bcrypt from "bcrypt"; // Importer bcrypt pour comparer les mots de passe
import jwt from "jsonwebtoken"; // Importer jsonwebtoken pour générer des tokens JWT
import { User } from "../db/sequelize.mjs"; // Importer le modèle User
import { privateKey } from "../auth/private_key.mjs"; // Importer la clé privée pour signer les tokens

const loginRouter = express(); // Créer une instance d'Express pour le login (normalement, on utiliserait express.Router())

// Route POST pour connecter un utilisateur
loginRouter.post("/", (req, res) => {
  // Recherche de l'utilisateur par username dans la DB
  User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      // Si aucun utilisateur n'est trouvé, renvoyer une 404
      if (!user) {
        return res
          .status(404)
          .json({ message: "L'utilisateur demandé n'existe pas" });
      }

      // Comparer le mot de passe fourni avec le mot de passe haché stocké
      bcrypt
        .compare(req.body.password, user.hashedPassword)
        .then((isPasswordValid) => {
          // Si le mot de passe est incorrect, renvoyer une 401
          if (!isPasswordValid) {
            return res
              .status(401)
              .json({ message: "Le mot de passe est incorrect." });
          }

          // Si le mot de passe est valide, générer un token JWT avec l'ID de l'utilisateur
          const token = jwt.sign({ userId: user.utilisateur_id }, privateKey, {
            expiresIn: "1y", // Le token expire dans 1 an
          });

          res.cookie("token", token, {
            sameSite: "Lax",
            secure: false, // true si tu es en HTTPS
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
          });

          // Renvoyer la réponse avec les données de l'utilisateur et le token
          return res.json({
            message: "L'utilisateur a été connecté avec succès",
            data: user,
          });
        });
    })
    .catch((error) => {
      // En cas d'erreur, renvoyer une réponse 500 et log l'erreur
      console.error("Erreur lors de la connexion :", error);
      return res
        .status(500)
        .json({ message: "Une erreur est survenue", error });
    });
});

export { loginRouter }; // Exporter le routeur pour l'utiliser dans l'application

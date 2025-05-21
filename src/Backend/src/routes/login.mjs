import express from "express"; // Importer Express pour créer l'API
import bcrypt from "bcrypt"; // Importer bcrypt pour comparer les mots de passe
import jwt from "jsonwebtoken"; // Importer jsonwebtoken pour générer des tokens JWT
import { User } from "../db/sequelize.mjs"; // Importer le modèle User
import { privateKey } from "../auth/private_key.mjs"; // Importer la clé privée pour signer les tokens

const loginRouter = express(); // Créer une instance d'Express pour le login (normalement, on utiliserait express.Router())

// Route POST pour connecter un utilisateur
loginRouter.post("/", (req, res) => {
  User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "L'utilisateur demandé n'existe pas" });
      }

      bcrypt
        .compare(req.body.password, user.hashedPassword)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            return res
              .status(401)
              .json({ message: "Le mot de passe est incorrect." });
          }

          const token = jwt.sign(
            { userId: user.utilisateur_id, isAdmin: user.isAdmin },
            privateKey,
            {
              expiresIn: "1y",
            }
          );

          // SET COOKIE
          res.cookie("token", token, {
            sameSite: "Lax",
            secure: false,
            maxAge: 365 * 24 * 60 * 60 * 1000,
          });

          //  SAUVEGARDE EN SESSION
          req.session.user = {
            utilisateur_id: user.utilisateur_id,
            username: user.username,
            isAdmin: user.isAdmin,
          };

          //  RÉPONSE
          return res.json({
            message: "L'utilisateur a été connecté avec succès",
            data: {
              utilisateur_id: user.utilisateur_id,
              username: user.username,
              isAdmin: user.isAdmin,
            },
          });
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la connexion :", error);
      return res
        .status(500)
        .json({ message: "Une erreur est survenue", error });
    });
});

export { loginRouter }; // Exporter le routeur pour l'utiliser dans l'application

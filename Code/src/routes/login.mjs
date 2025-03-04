import express from "express"; // Importer le module express
import bcrypt from "bcrypt"; // Importer bcrypt pour comparer les mots de passe
import jwt from "jsonwebtoken"; // Importer jsonwebtoken pour créer des tokens JWT
import { User } from "../db/sequelize.mjs"; // Importer le modèle User depuis la configuration Sequelize (vérifier le chemin)
import { privateKey } from "../auth/private_key.mjs"; // Importer la clé privée pour signer les tokens JWT

const loginRouter = express(); // Créer une instance d'Express (idéalement, on utiliserait express.Router())

// Route POST pour la connexion d'un utilisateur
loginRouter.post("/", (req, res) => {
  // Rechercher un utilisateur en fonction du username fourni dans le corps de la requête
  User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      // Si aucun utilisateur n'est trouvé, retourner une réponse 404
      if (!user) {
        return res
          .status(404)
          .json({ message: "L'utilisateur demandé n'existe pas" });
      }
 
      // Comparer le mot de passe fourni avec le mot de passe haché stocké
      bcrypt
        .compare(req.body.password, user.hashedPassword)
        .then((isPasswordValid) => {
          // Si le mot de passe ne correspond pas, retourner une réponse 401
          if (!isPasswordValid) {
            return res
              .status(401)
              .json({ message: "Le mot de passe est incorrect." });
          }
 
          // Si le mot de passe est valide, créer un token JWT avec l'identifiant de l'utilisateur
          const token = jwt.sign({ userId: user.utilisateur_id }, privateKey, {
            expiresIn: "1y", // Le token expire dans 1 an
          });
          // Retourner une réponse de succès avec les données de l'utilisateur et le token
          return res.json({
            message: "L'utilisateur a été connecté avec succès",
            data: user,
            token,
          });
        });
    })
    .catch((error) => {
      // En cas d'erreur lors de la connexion, afficher l'erreur dans la console et retourner une réponse 500
      console.error("Erreur lors de la connexion :", error);
      return res
        .status(500)
        .json({ message: "Une erreur est survenue", error });
    });
});
 
export { loginRouter }; // Exporter le routeur pour l'utiliser dans l'application principale

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs"; // Verif si chemin correct
import { privateKey } from "../auth/private_key.mjs";
 
const loginRouter = express();
 
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
 
          const token = jwt.sign({ userId: user.utilisateur_id }, privateKey, {
            expiresIn: "1y",
          });
          return res.json({
            message: "L'utilisateur a été connecté avec succès",
            data: user,
            token,
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
 
export { loginRouter };
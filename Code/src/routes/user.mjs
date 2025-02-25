import express from "express";
import { User } from "../db/sequelize.mjs"; // Vérifie que le chemin est correct
 
const userRouter = express.Router();
 
// Route pour récupérer un utilisateur par ID
userRouter.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
 
    // Recherche de l'utilisateur
    const user = await User.findByPk(userId, {
      attributes: ["utilisateur_id", "username", "dateSignup", "isAdmin"], // Exclure le mot de passe
    });
 
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
 
    res.json({ message: "Utilisateur trouvé !", data: user });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});
 
export { userRouter };
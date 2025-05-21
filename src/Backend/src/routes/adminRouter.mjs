import express from "express";
import { User, Livre } from "../db/sequelize.mjs"; // User = Utilisateur
import { auth } from "../auth/auth.mjs";

const adminRouter = express.Router();

adminRouter.get("/data", auth, async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ message: "Accès refusé : admin uniquement." });
  }

  try {
    const utilisateurs = await User.findAll({
      attributes: ["utilisateur_id", "username", "isAdmin"],
    });

    const livres = await Livre.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
          as: "utilisateur",
        },
      ],
    });

    res.json({ utilisateurs, livres });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export { adminRouter };

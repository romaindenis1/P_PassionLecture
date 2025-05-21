import express from "express";
import bcrypt from "bcrypt";
import { User, Livre, Apprecier, Auteur, Categorie } from "../db/sequelize.mjs";
import { auth } from "../auth/auth.mjs";

const userRouter = express.Router();

// GET / - Récupérer tous les utilisateurs, avec filtres optionnels par ID ou username
userRouter.get("/", async (req, res) => {
  try {
    const { id, username } = req.query;
    const whereClause = {};
    if (id) whereClause.utilisateur_id = id;
    if (username) whereClause.username = username;

    const users = await User.findAll({
      where: whereClause,
      attributes: ["utilisateur_id", "username", "dateSignup", "isAdmin"],
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }
    res.json({ message: "Utilisateur(s) trouvé(s).", data: users });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

// GET /:id - Récupérer les informations d'un utilisateur
userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["utilisateur_id", "username", "dateSignup", "isAdmin"],
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    return res.json({
      message: "Utilisateur récupéré avec succès.",
      data: user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

// PUT / - Mettre à jour un utilisateur (authentifié ou admin seulement)
userRouter.put("/", auth, async (req, res) => {
  try {
    const { id, username, password } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "L'ID de l'utilisateur est requis pour la mise à jour.",
      });
    }

    if (req.userId !== parseInt(id) && !req.isAdmin) {
      return res.status(403).json({ message: "Non autorisé." });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (username) user.username = username;
    if (password) user.hashedPassword = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Utilisateur mis à jour avec succès.", data: user });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

// DELETE / - Supprimer un utilisateur par ID ou username (admin ou propriétaire)
userRouter.delete("/", auth, async (req, res) => {
  try {
    const { id, username } = req.query;
    if (!id && !username) {
      return res.status(400).json({
        message: "Un ID ou un username est requis pour la suppression.",
      });
    }

    const whereClause = id ? { utilisateur_id: id } : { username };
    const user = await User.findOne({ where: whereClause });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (req.userId !== user.utilisateur_id && !req.isAdmin) {
      return res.status(403).json({ message: "Non autorisé." });
    }

    await Apprecier.destroy({ where: { utilisateur_fk: user.utilisateur_id } });
    await user.destroy();

    res.json({
      message: "Utilisateur et ses notations supprimés avec succès.",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

// GET /:id/livres - Récupérer les livres d'un utilisateur (protégé contre accès externe)
userRouter.get("/:id/livres", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const isOwner = req.userId === parseInt(id);
    if (!isOwner && !req.isAdmin) {
      return res
        .status(403)
        .json({ message: "Accès non autorisé à ces livres." });
    }

    const livres = await Livre.findAll({
      where: { utilisateur_fk: id },
      include: [
        { model: Auteur, as: "auteur" },
        { model: Categorie, as: "categorie" },
        {
          model: User,
          as: "utilisateur",
          attributes: ["utilisateur_id", "username"],
        },
      ],
    });

    return res.json({
      message:
        livres.length > 0
          ? "Livres trouvés pour l'utilisateur."
          : "Aucun livre trouvé pour cet utilisateur.",
      data: livres,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des livres :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

export { userRouter };

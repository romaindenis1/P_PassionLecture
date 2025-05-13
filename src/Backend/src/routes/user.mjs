import express from "express"; // Importer Express pour créer le routeur
import bcrypt from "bcrypt"; // Importer bcrypt pour hacher les mots de passe
import { User } from "../db/sequelize.mjs"; // Importer le modèle User depuis la base de données
import { Livre } from "../db/sequelize.mjs"; // Importer le modèle Livre
import { Apprecier } from "../db/sequelize.mjs"; // Importer le modèle Livre
import { Auteur, Categorie } from "../db/sequelize.mjs"; // Importer le modèle Livre

const userRouter = express.Router(); // Créer un routeur pour les routes utilisateurs

// GET / - Récupérer tous les utilisateurs, avec filtres optionnels par ID ou username
userRouter.get("/", async (req, res) => {
  try {
    const { id, username } = req.query; // Extraire les filtres de la requête
    const whereClause = {};
    if (id) whereClause.utilisateur_id = id;
    if (username) whereClause.username = username;

    // Récupérer les utilisateurs en ne sélectionnant que certains attributs
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

// PUT / - Mettre à jour un utilisateur via ID (mise à jour du username et/ou mot de passe)
userRouter.put("/", async (req, res) => {
  try {
    const { id, username, password } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "L'ID de l'utilisateur est requis pour la mise à jour.",
      });
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

// DELETE / - Supprimer un utilisateur par ID ou username
userRouter.delete("/", async (req, res) => {
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

    // Supprimer d'abord les enregistrements dépendants dans t_apprecier
    await Apprecier.destroy({ where: { utilisateur_fk: user.utilisateur_id } });

    // Maintenant, supprimer l'utilisateur
    await user.destroy();
    res.json({
      message: "Utilisateur et ses notations supprimés avec succès.",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});

// GET /:id/livres - Récupérer les livres liés à un utilisateur

userRouter.get("/:id/livres", async (req, res) => {
  try {
    const { id } = req.params;
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

export { userRouter }; // Exporter le routeur pour l'intégrer dans l'application

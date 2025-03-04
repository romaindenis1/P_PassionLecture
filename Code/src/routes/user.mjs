import express from "express"; // Importer le module Express
import bcrypt from "bcrypt"; // Importer bcrypt pour le hachage de mots de passe
import { User } from "../db/sequelize.mjs"; // Importer le modèle User depuis la base de données
import { Livre } from "../db/sequelize.mjs";

const userRouter = express.Router(); // Créer un routeur pour les routes liées aux utilisateurs

// Route GET pour récupérer les utilisateurs, filtrable par ID ou username
userRouter.get("/", async (req, res) => {
  try {
    const { id, username } = req.query; // Extraire id et username des paramètres de requête
    const whereClause = {}; // Initialiser un objet pour la clause WHERE

    if (id) whereClause.utilisateur_id = id; // Si id est fourni, l'ajouter à la clause WHERE
    if (username) whereClause.username = username; // Si username est fourni, l'ajouter à la clause WHERE

    // Rechercher tous les utilisateurs correspondant à la clause WHERE en sélectionnant des attributs spécifiques
    const users = await User.findAll({
      where: whereClause,
      attributes: ["utilisateur_id", "username", "dateSignup", "isAdmin"],
    });

    // Si aucun utilisateur n'est trouvé, retourner un message d'erreur 404
    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    // Retourner les utilisateurs trouvés avec un message de succès
    res.json({
      message: "Utilisateur(s) trouvé(s).",
      data: users,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error); // Afficher l'erreur dans la console
    res.status(500).json({ message: "Une erreur est survenue.", error }); // Retourner une erreur 500
  }
});

// Route PUT pour mettre à jour un utilisateur (mise à jour uniquement par ID)
userRouter.put("/", async (req, res) => {
  try {
    const { id, username, password } = req.body; // Extraire id, username et password du corps de la requête

    if (!id) {
      // Si aucun ID n'est fourni, retourner une erreur 400
      return res.status(400).json({ message: "L'ID de l'utilisateur est requis pour la mise à jour." });
    }

    // Rechercher l'utilisateur par sa clé primaire (ID)
    const user = await User.findByPk(id);
    if (!user) {
      // Si l'utilisateur n'existe pas, retourner une erreur 404
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mettre à jour le username si fourni
    if (username) user.username = username;
    // Mettre à jour le mot de passe s'il est fourni (après l'avoir haché)
    if (password) user.hashedPassword = await bcrypt.hash(password, 10);

    // Enregistrer les modifications dans la base de données
    await user.save();
    // Retourner l'utilisateur mis à jour avec un message de succès
    res.json({ message: "Utilisateur mis à jour avec succès.", data: user });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error); // Afficher l'erreur dans la console
    res.status(500).json({ message: "Une erreur est survenue.", error }); // Retourner une erreur 500
  }
});

// Route DELETE pour supprimer un utilisateur par ID ou username
userRouter.delete("/", async (req, res) => {
  try {
    const { id, username } = req.query; // Extraire id et username des paramètres de requête

    if (!id && !username) {
      // Si ni id ni username n'est fourni, retourner une erreur 400
      return res.status(400).json({ message: "Un ID ou un username est requis pour la suppression." });
    }

    // Construire la clause WHERE selon que l'on dispose d'un ID ou d'un username
    const whereClause = id ? { utilisateur_id: id } : { username };
    // Rechercher l'utilisateur correspondant
    const user = await User.findOne({ where: whereClause });

    if (!user) {
      // Si l'utilisateur n'est pas trouvé, retourner une erreur 404
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Supprimer l'utilisateur de la base de données
    await user.destroy();
    // Retourner un message de succès indiquant que l'utilisateur a été supprimé
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error); // Afficher l'erreur dans la console
    res.status(500).json({ message: "Une erreur est survenue.", error }); // Retourner une erreur 500
  }
});


userRouter.get("/:id/livres", async (req, res) => {
  try {
    const { id } = req.params;
    const livres = await Livre.findAll({ where: { utilisateur_fk: id } });

    if (!livres || livres.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé pour cet utilisateur." });
    }

    res.json({
      message: "Livres trouvés pour l'utilisateur.",
      data: livres,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des livres :", error);
    res.status(500).json({ message: "Une erreur est survenue.", error });
  }
});


export { userRouter }; // Exporter le routeur pour l'utiliser dans l'application principale

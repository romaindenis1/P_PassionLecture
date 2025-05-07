// Importation de Sequelize et des modèles depuis le fichier structure.mjs
import { Sequelize } from "sequelize";
import {
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  LivreModel,
  ApprecierModel,
  LaisserModel,
  defineRelations,
} from "../models/structure.mjs";

// Import des données fictives (mock) pour alimenter la BDD
import livres from "./mock-product.mjs";
import categories from "./mock-category.mjs";
import editeurs from "./mock-editor.mjs";
import auteurs from "./mock-author.mjs";
import utilisateurs from "./mock-user.mjs";
import commentaires from "./mock-comments.mjs";
import notes from "./mock-note.mjs"; // Données pour les notes

// Création de l'instance Sequelize avec la configuration MySQL
const sequelize = new Sequelize("db_livre", "root", "root", {
  port: 6033,
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Initialisation des modèles avec Sequelize.DataTypes
const Categorie = CategorieModel(sequelize, Sequelize.DataTypes);
const Utilisateur = UtilisateurModel(sequelize, Sequelize.DataTypes);
const Livre = LivreModel(sequelize, Sequelize.DataTypes);
const Editeur = EditeurModel(sequelize, Sequelize.DataTypes);
const Auteur = AuteurModel(sequelize, Sequelize.DataTypes);
const Laisser = LaisserModel(sequelize, Sequelize.DataTypes);
const Apprecier = ApprecierModel(sequelize, Sequelize.DataTypes);

// Définition des relations entre les modèles
const models = {
  Auteur,
  Categorie,
  Utilisateur,
  Editeur,
  Livre,
  Laisser,
  Apprecier,
};
defineRelations(models);

// Fonction d'initialisation de la base de données et d'importation des données
const initDb = async () => {
  try {
    // Désactivation temporaire des vérifications des clés étrangères
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    // Synchronisation forcée (recréation des tables)
    await sequelize.sync({ force: true });
    // Réactivation des vérifications des clés étrangères
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");

    // Importation des données dans l'ordre logique
    await importCategories();
    await importEditeurs();
    await importUtilisateurs();
    await importAuthors();
    await importProducts();
    await importComments();
    await importNotes();

    console.log("La base de données db_livre a bien été synchronisée");
  } catch (error) {
    console.error(
      "Erreur lors de la synchronisation de la base de données",
      error
    );
  }
};

// Importation des utilisateurs
const importUtilisateurs = async () => {
  try {
    const result = await Utilisateur.bulkCreate(utilisateurs, {
      validate: true,
    });
    console.log(`${result.length} utilisateurs ont été ajoutés avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'import des utilisateurs :", error);
  }
};

// Importation des commentaires en vérifiant l'existence du livre et de l'utilisateur
const importComments = async () => {
  try {
    for (let comment of commentaires) {
      const bookExists = await Livre.findByPk(comment.livre_id);
      const userExists = await Utilisateur.findByPk(comment.utilisateur_id);
      if (bookExists && userExists) {
        await Laisser.create({
          contenu: comment.contenu,
          livre_fk: comment.livre_id,
          utilisateur_fk: comment.utilisateur_id,
        });
      }
    }
    console.log("Les commentaires ont été ajoutés avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'import des commentaires :", error);
  }
};

// Importation des notes en vérifiant l'existence du livre et de l'utilisateur
const importNotes = async () => {
  try {
    for (let note of notes) {
      const bookExists = await Livre.findByPk(note.livre_id);
      const userExists = await Utilisateur.findByPk(note.utilisateur_id);
      if (bookExists && userExists) {
        await Apprecier.create({
          note: note.note,
          livre_fk: note.livre_id,
          utilisateur_fk: note.utilisateur_id,
        });
      } else {
        console.warn(
          `Livre ou Utilisateur inexistant - Livre ID: ${note.livre_id}, Utilisateur ID: ${note.utilisateur_id}`
        );
      }
    }
    console.log("Les notes ont été ajoutées avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'import des notes :", error);
  }
};

// Importation des auteurs
const importAuthors = async () => {
  try {
    const result = await Auteur.bulkCreate(auteurs, { validate: true });
    console.log(`${result.length} auteurs ont été ajoutés avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'import des auteurs:", error);
  }
};

// Importation des éditeurs
const importEditeurs = async () => {
  try {
    const result = await Editeur.bulkCreate(editeurs, { validate: true });
    console.log(`${result.length} éditeurs ont été ajoutés avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'import des éditeurs:", error);
  }
};

// Importation des catégories
const importCategories = async () => {
  try {
    const result = await Categorie.bulkCreate(categories, { validate: true });
    console.log(`${result.length} catégories ont été ajoutées avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'import des catégories:", error);
  }
};

// Importation des livres
const importProducts = async () => {
  try {
    if (Array.isArray(livres)) {
      await Livre.bulkCreate(livres, { validate: true });
      console.log("Les livres ont été ajoutés avec succès.");
    } else {
      console.error("Erreur : 'livres' n'est pas un tableau", livres);
    }
  } catch (error) {
    console.error("Erreur lors de l'import des livres :", error);
  }
};

// Export des fonctions et variables utiles pour d'autres modules
export {
  initDb,
  LivreModel,
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  ApprecierModel,
  livres,
  Livre,
};
export { sequelize, Apprecier };
export { Utilisateur as User };
export { Auteur, Categorie };

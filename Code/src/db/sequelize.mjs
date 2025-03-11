import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import {
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  LivreModel,
  ApprecierModel,
  LaisserModel,
} from "../models/structure.mjs";
import livres from "./mock-product.mjs";
import categories from "./mock-category.mjs";
import editeurs from "./mock-editor.mjs";
import auteurs from "./mock-author.mjs";
import utilisateurs from "./mock-user.mjs";
import commentaires from "./mock-comments.mjs";
import notes from "./mock-note.mjs"; // Importation des notes

const sequelize = new Sequelize("db_livre", "root", "root", {
  port: 6033,
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const Categorie = CategorieModel(sequelize, Sequelize.DataTypes);
const Utilisateur = UtilisateurModel(sequelize, Sequelize.DataTypes);
const Livre = LivreModel(sequelize, Sequelize.DataTypes);
const Editeur = EditeurModel(sequelize, Sequelize.DataTypes);
const Auteur = AuteurModel(sequelize, Sequelize.DataTypes);
const Laisser = LaisserModel(sequelize, Sequelize.DataTypes);
const Apprecier = ApprecierModel(sequelize, Sequelize.DataTypes); // Correction ici

const initDb = async () => {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
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

const importNotes = async () => {
  try {
    for (let note of notes) {
      const bookExists = await Livre.findByPk(note.livre_id);
      const userExists = await Utilisateur.findByPk(note.utilisateur_id);

      if (bookExists && userExists) {
        await Apprecier.create({
          note: note.note,
          livre_fk: note.livre_id, // Vérifie que la colonne dans la DB s'appelle bien "livre_fk"
          utilisateur_fk: note.utilisateur_id, // Vérifie que la colonne dans la DB s'appelle bien "utilisateur_fk"
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

const importAuthors = async () => {
  try {
    const result = await Auteur.bulkCreate(auteurs, {
      validate: true,
    });
    console.log(`${result.length} auteurs ont été ajoutés avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'import des auteurs:", error);
  }
};

const importEditeurs = async () => {
  try {
    const result = await Editeur.bulkCreate(editeurs, {
      validate: true,
    });
    console.log(`${result.length} éditeurs ont été ajoutés avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'import des éditeurs:", error);
  }
};

const importCategories = async () => {
  try {
    const result = await Categorie.bulkCreate(categories, {
      validate: true,
    });
    console.log(`${result.length} catégories ont été ajoutées avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'import des catégories:", error);
  }
};

const importProducts = async () => {
  try {
    if (Array.isArray(livres)) {
      await Livre.bulkCreate(livres, {
        validate: true,
      });
      console.log("Les livres ont été ajoutés avec succès.");
    } else {
      console.error("Erreur : 'livres' n'est pas un tableau", livres);
    }
  } catch (error) {
    console.error("Erreur lors de l'import des livres :", error);
  }
};

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
export { sequelize };

export { Utilisateur as User };

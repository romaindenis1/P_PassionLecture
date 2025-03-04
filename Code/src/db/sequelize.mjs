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
const sequelize = new Sequelize(
  "db_livre", 
  "root", 
  "root",
  {
    port: 6033,
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);
const Categorie = CategorieModel(sequelize, Sequelize.DataTypes);
const Utilisateur = UtilisateurModel(sequelize, Sequelize.DataTypes);
const Livre = LivreModel(sequelize, Sequelize.DataTypes);
const Editeur = EditeurModel(sequelize, Sequelize.DataTypes);
const Auteur = AuteurModel(sequelize, Sequelize.DataTypes);
const Laisser = LaisserModel(sequelize, Sequelize.DataTypes);

const initDb = async () => {
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    await importCategories();
    await importEditeurs(); 
    await importProducts();
    await importAuthors();
    await importComments();
    await importUtilisateurs();
    console.log("La base de données db_livre a bien été synchronisée");
  } catch (error) {
    console.error("Erreur lors de la synchronisation de la base de données", error);
  }
};


const importUtilisateurs = async () => {
  try {
    // Utiliser la méthode bulkCreate du modèle Utilisateur pour insérer plusieurs enregistrements
    const result = await Utilisateur.bulkCreate(utilisateurs, { validate: true });
    console.log(`${result.length} utilisateurs ont été ajoutés avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'import des utilisateurs :", error);
  }
};



const importComments = async () => {
  try {
    const comments = commentaires;
    // Check if the referenced livre_fk and utilisateur_fk exist
    for (let comment of comments) {
      const bookExists = await Livre.findByPk(comment.livre_id);
      const userExists = await Utilisateur.findByPk(comment.utilisateur_id);

      // Proceed to create the comment
      await Laisser.create({
        contenu: comment.contenu,
        livre_fk: comment.livre_fk,
        utilisateur_fk: comment.utilisateur_fk,
      });
    }

    console.log("Comments have been successfully added.");
  } catch (error) {
    console.error("Error importing comments:", error);
  }
};



// Fonction pour importer les auteurs depuis mock-author.mjs
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
    console.log(`${result.length} editeurs have been successfully added.`);
  } catch (error) {
    console.error("Error importing editors:", error);
  }
};

const importCategories = async () => {
  try {

    const result = await Categorie.bulkCreate(categories, {
      validate: true, 
    });
    console.log(`${result.length} categories have been successfully added.`);
  } catch (error) {
    console.error('Error importing categories:', error);
  }
};
const importProducts = () => {
  try {
    if (Array.isArray(livres)) {
      livres.map((livre) => {
        Livre.create({
          titre: livre.titre,
          imageCouverturePath: livre.imageCouverturePath,
          nbPage: livre.nbPage,
          lien: livre.lien,
          resume: livre.resume,
          anneeEdition: livre.anneeEdition,
          utilisateur_fk: livre.utilisateur_fk,
          editeur_fk: livre.editeur_fk,
          categorie_fk: livre.categorie_fk,
          auteur_fk: livre.auteur_fk,
        })
      });
    } else {
      console.error("Erreur : 'livres' n'est pas un tableau", livres);
    }
  } catch (error) {
    console.error("Erreur lors de l'import des produits", error);
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
  Livre
};
export {sequelize}

export { Utilisateur as User };
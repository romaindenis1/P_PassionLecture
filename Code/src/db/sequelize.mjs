import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import {
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  LivreModel,
  ApprecierModel,
} from "../models/structure.mjs";
import livres from "./mock-product.mjs";
import categories from "./mock-category.mjs";
import editeurs from "./mock-editor.mjs";
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

const initDb = async () => {
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    await importUsers();
    await importCategories();
    await importEditeurs(); 
    await importProducts();
    console.log("La base de données db_livre a bien été synchronisée");
  } catch (error) {
    console.error("Erreur lors de la synchronisation de la base de données", error);
  }
};

const importUsers = async () => {
  try {
    const hash = await bcrypt.hash("etml", 10);
    const user = await Utilisateur.create({
      username: "admin",
      hashedPassword: hash,
      dateSignup: new Date(),
      isAdmin: true,
    });
    
    console.log("Utilisateur ajouté", user.toJSON());
  } catch (error) {
    console.error("Erreur lors de l'import des utilisateurs", error);
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
};
export {sequelize}

export { Utilisateur as User };
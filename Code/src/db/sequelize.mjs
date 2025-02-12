import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import {
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  LivreModel,
  CommenterModel,
  ApprecierModel,
} from "../models/structure.mjs";
import livres from "./mock-product.mjs";

const sequelize = new Sequelize("db_livre", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const initDb = async () => {
  try {
    await sequelize.sync({ force: true });
    await importUsers();
    await importProducts();
    console.log("La base de données db_livre a bien été synchronisée");
  } catch (error) {
    console.error("Erreur lors de la synchronisation de la base de données", error);
  }
};

const importUsers = async () => {
  try {
    const hash = await bcrypt.hash("etml", 10);
    const user = await UtilisateurModel(sequelize, Sequelize.DataTypes).create({
      username: "admin",
      hashedPassword: hash,
      dateSignup: new Date(),
      isAdmin: true,
    });
    console.log(user.toJSON());
  } catch (error) {
    console.error("Erreur lors de l'import des utilisateurs", error);
  }
};

const importProducts = async () => {
  try {
    for (const livre of livres) {
      const newLivre = await LivreModel(sequelize, Sequelize.DataTypes).create({
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
      });
      console.log(newLivre.toJSON());
    }
  } catch (error) {
    console.error("Erreur lors de l'import des produits", error);
  }
};

export {
  sequelize,
  initDb,
  LivreModel,
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  CommenterModel,
  ApprecierModel,
  livres,
};

export { UtilisateurModel as User };
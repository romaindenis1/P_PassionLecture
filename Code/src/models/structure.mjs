import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.mjs';

const AuteurModel = (sequelize, DataTypes) => {
  return sequelize.define('Auteur', {
    auteur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
  });
};

const CategorieModel = (sequelize, DataTypes) => {
  return sequelize.define('Categorie', {
    categorie_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    libelle: { type: DataTypes.STRING, allowNull: false, unique: true },
  });
};

const UtilisateurModel = (sequelize, DataTypes) => {
  return sequelize.define('Utilisateur', {
    utilisateur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: { msg: "Ce username est déjà pris." } },
    hashedPassword: { type: DataTypes.STRING, allowNull: false },
    dateSignup: { type: DataTypes.DATE, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false },
  });
};

const EditeurModel = (sequelize, DataTypes) => {
  return sequelize.define('Editeur', {
    editeur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING(50), allowNull: false },
  });
};

const LivreModel = (sequelize, DataTypes) => {
  return sequelize.define('Livre', {
    livre_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    imageCouverturePath: { type: DataTypes.STRING, allowNull: false },
    titre: { type: DataTypes.STRING, allowNull: false },
    nbPage: { type: DataTypes.INTEGER, allowNull: false },
    lien: { type: DataTypes.STRING, allowNull: false, unique: true },
    resume: { type: DataTypes.STRING(3000), allowNull: false },
    anneeEdition: { type: DataTypes.TINYINT, allowNull: false },
  });
};

const CommenterModel = (sequelize, DataTypes) => {
  return sequelize.define('Commenter', {
    contenu: { type: DataTypes.STRING(5000), allowNull: false },
  }, { timestamps: false });
};

const ApprecierModel = (sequelize, DataTypes) => {
  return sequelize.define('Apprecier', {
    note: { type: DataTypes.TINYINT, allowNull: false },
  }, { timestamps: false });
};

export {
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  LivreModel,
  CommenterModel,
  ApprecierModel,
};

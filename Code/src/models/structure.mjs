import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.mjs";

// Modèle Auteur
const AuteurModel = (sequelize, DataTypes) => {
  return sequelize.define("t_auteur", {
    auteur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
  });
};

// Modèle Catégorie
const CategorieModel = (sequelize, DataTypes) => {
  return sequelize.define("t_categorie", {
    categorie_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    libelle: { type: DataTypes.STRING, allowNull: false, unique: true },
  });
};

// Modèle Utilisateur
const UtilisateurModel = (sequelize, DataTypes) => {
  return sequelize.define("t_utilisateur", {
    utilisateur_id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    username: { 
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: { msg: "Ce username est déjà pris." } 
    },
    hashedPassword: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    dateSignup: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    isAdmin: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false 
    },
  }, {
    tableName: "t_utilisateur",  
    timestamps: true,  
  });
};

// Modèle Editeur
const EditeurModel = (sequelize, DataTypes) => {
  return sequelize.define("t_editeur", {
    editeur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING(50), allowNull: false },
  });
};

const LivreModel = (sequelize, DataTypes) => {
  return sequelize.define("t_livre", {
    livre_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titre: { type: DataTypes.STRING(255), allowNull: false }, 
    imageCouverturePath: { type: DataTypes.STRING(255), allowNull: false }, 
    nbPage: { type: DataTypes.INTEGER, allowNull: false }, 
    anneeEdition: { type: DataTypes.INTEGER, allowNull: false }, 
    lien: { type: DataTypes.STRING(255), allowNull: true }, 
    resume: { type: DataTypes.TEXT, allowNull: true }, 
  }, {
    freezeTableName: true, 
    tableName: 't_livre' 
  });
};

// Modèle Laisser un Commentaire
const LaisserModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_laisser",
    {
      contenu: { type: DataTypes.STRING(5000), allowNull: false },
    },
    { timestamps: false }
  );
};

// Modèle Apprécier (notation)
const ApprecierModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_apprecier",
    {
      note: { type: DataTypes.TINYINT, allowNull: false },
    },
    { timestamps: false }
  );
};

// Définition des relations entre les tables
const defineRelations = (models) => {
  const { Auteur, Categorie, Utilisateur, Editeur, Livre, Laisser, Apprecier } = models;

  // Relations Livre
  Livre.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk" });
  Livre.belongsTo(Editeur, { foreignKey: "editeur_fk" });
  Livre.belongsTo(Categorie, { foreignKey: "categorie_fk" });
  Livre.belongsTo(Auteur, { foreignKey: "auteur_fk" });

  // Relations Laisser un Commentaire
  Laisser.belongsTo(Livre, { foreignKey: "livre_fk" });
  Laisser.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk" });

  // Relations Apprécier (notation)
  Apprecier.belongsTo(Livre, { foreignKey: "livre_fk" });
  Apprecier.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk" });
};

export {
  AuteurModel,
  CategorieModel,
  UtilisateurModel,
  EditeurModel,
  LivreModel,
  LaisserModel,
  ApprecierModel,
  defineRelations,
};
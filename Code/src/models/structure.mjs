import { DataTypes } from "sequelize"; // Importer DataTypes depuis Sequelize pour définir les types de données
import { sequelize } from "../db/sequelize.mjs"; // Importer l'instance de Sequelize configurée pour la connexion à la base de données

// Modèle Auteur
const AuteurModel = (sequelize, DataTypes) => {
  // Définir le modèle "t_auteur" avec ses attributs
  return sequelize.define("t_auteur", {
    // Clé primaire auto-incrémentée "auteur_id"
    auteur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // Champ "nom" obligatoire de type chaîne de caractères
    nom: { type: DataTypes.STRING, allowNull: false },
  });
};

// Modèle Catégorie
const CategorieModel = (sequelize, DataTypes) => {
  // Définir le modèle "t_categorie" avec ses attributs
  return sequelize.define("t_categorie", {
    // Clé primaire auto-incrémentée "categorie_id"
    categorie_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // Champ "libelle" obligatoire, de type chaîne, et unique
    libelle: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    tableName: 't_categories', // Spécifier le nom de la table dans la base de données
    timestamps: false,         // Désactiver la gestion automatique des timestamps (createdAt, updatedAt)
  });
};

// Modèle Utilisateur
const UtilisateurModel = (sequelize, DataTypes) => {
  // Définir le modèle "t_utilisateur" avec ses attributs
  return sequelize.define("t_utilisateur", {
    // Clé primaire auto-incrémentée "utilisateur_id"
    utilisateur_id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    // Champ "username" obligatoire, de longueur maximale 50, unique avec message d'erreur personnalisé
    username: { 
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: { msg: "Ce username est déjà pris." } 
    },
    // Champ "hashedPassword" obligatoire pour stocker le mot de passe haché
    hashedPassword: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    // Champ "dateSignup" obligatoire de type DATE
    dateSignup: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    // Champ "isAdmin" obligatoire de type BOOLEAN
    isAdmin: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false 
    },
  }, {
    tableName: "t_utilisateur", // Spécifier le nom de la table dans la base de données
    timestamps: true,           // Activer la gestion automatique des timestamps
  });
};

// Modèle Editeur
const EditeurModel = (sequelize, DataTypes) => {
  // Définir le modèle "t_editeur" avec ses attributs
  return sequelize.define("t_editeur", {
    // Clé primaire auto-incrémentée "editeur_id"
    editeur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // Champ "nom" obligatoire, de longueur maximale 50
    nom: { type: DataTypes.STRING(50), allowNull: false },
  });
};

// Modèle Livre
const LivreModel = (sequelize, DataTypes) => {
  return sequelize.define("t_livre", {
    livre_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titre: { type: DataTypes.STRING(255), allowNull: false }, 
    imageCouverturePath: { type: DataTypes.STRING(255), allowNull: false }, 
    nbPage: { type: DataTypes.INTEGER, allowNull: false }, 
    anneeEdition: { type: DataTypes.INTEGER, allowNull: false }, 
    lien: { type: DataTypes.STRING(255), allowNull: true }, 
    resume: { type: DataTypes.TEXT, allowNull: true },
    // Ajoutez les colonnes pour les clés étrangères
    utilisateur_fk: { type: DataTypes.INTEGER, allowNull: true },
    editeur_fk: { type: DataTypes.INTEGER, allowNull: true },
    categorie_fk: { type: DataTypes.INTEGER, allowNull: true },
    auteur_fk: { type: DataTypes.INTEGER, allowNull: true },
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
      contenu: { type: DataTypes.STRING(5000), allowNull: true },
      livre_fk: { type: DataTypes.INTEGER, allowNull: true },
      utilisateur_fk: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      timestamps: false, 
      freezeTableName: true, 
    }
  );
};

// Modèle Apprécier (notation)
const ApprecierModel = (sequelize, DataTypes) => {
  // Définir le modèle "t_apprecier" avec son attribut
  return sequelize.define(
    "t_apprecier",
    {
      // Champ "note" obligatoire de type TINYINT
      note: { type: DataTypes.TINYINT, allowNull: false },
    },
    { timestamps: false } // Désactiver la gestion automatique des timestamps
  );
};

const defineRelations = (models) => {
  // Extract the models from the models object
  const { Auteur, Categorie, Utilisateur, Editeur, Livre, Laisser, Apprecier } = models;

  // Relations between Livre and Utilisateur
  Livre.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk", targetKey: "utilisateur_id" });
  Utilisateur.hasMany(Livre, { foreignKey: "utilisateur_fk" });

  // Relations between Livre and Editeur
  Livre.belongsTo(Editeur, { foreignKey: "editeur_fk", targetKey: "editeur_id" });
  Editeur.hasMany(Livre, { foreignKey: "editeur_fk" });

  // Relations between Livre and Categorie
  Livre.belongsTo(Categorie, { foreignKey: "categorie_fk", targetKey: "categorie_id" });
  Categorie.hasMany(Livre, { foreignKey: "categorie_fk" });

  // Relations between Livre and Auteur
  Livre.belongsTo(Auteur, { foreignKey: "auteur_fk", targetKey: "auteur_id" });
  Auteur.hasMany(Livre, { foreignKey: "auteur_fk" });

  // Relations between Laisser (Comment) and Livre
  Laisser.belongsTo(Livre, { foreignKey: "livre_fk", targetKey: "livre_id" });
  Livre.hasMany(Laisser, { foreignKey: "livre_fk" });

  // Relations between Laisser (Comment) and Utilisateur
  Laisser.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk", targetKey: "utilisateur_id" });
  Utilisateur.hasMany(Laisser, { foreignKey: "utilisateur_fk" });

  // Relations between Apprécier (Rating) and Livre
  Apprecier.belongsTo(Livre, { foreignKey: "livre_fk", targetKey: "livre_id" });
  Livre.hasMany(Apprecier, { foreignKey: "livre_fk" });

  // Relations between Apprécier (Rating) and Utilisateur
  Apprecier.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk", targetKey: "utilisateur_id" });
  Utilisateur.hasMany(Apprecier, { foreignKey: "utilisateur_fk" });
};



// Exporter tous les modèles et la fonction de définition des relations
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

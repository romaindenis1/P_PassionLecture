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
  // Définir le modèle "t_livre" avec ses attributs
  return sequelize.define("t_livre", {
    // Clé primaire auto-incrémentée "livre_id"
    livre_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // Champ "titre" obligatoire, de longueur maximale 255
    titre: { type: DataTypes.STRING(255), allowNull: false }, 
    // Champ "imageCouverturePath" obligatoire, de longueur maximale 255
    imageCouverturePath: { type: DataTypes.STRING(255), allowNull: false }, 
    // Champ "nbPage" obligatoire de type INTEGER
    nbPage: { type: DataTypes.INTEGER, allowNull: false }, 
    // Champ "anneeEdition" obligatoire de type INTEGER
    anneeEdition: { type: DataTypes.INTEGER, allowNull: false }, 
    // Champ "lien" facultatif, de longueur maximale 255
    lien: { type: DataTypes.STRING(255), allowNull: true }, 
    // Champ "resume" facultatif de type TEXT
    resume: { type: DataTypes.TEXT, allowNull: true }, 
  }, {
    freezeTableName: true, // Désactiver la pluralisation automatique du nom de table
    tableName: 't_livre'     // Spécifier le nom exact de la table dans la base de données
  });
};

// Modèle Laisser un Commentaire
const LaisserModel = (sequelize, DataTypes) => {
  // Définir le modèle "t_laisser" avec son attribut
  return sequelize.define(
    "t_laisser",
    {
      // Champ "contenu" obligatoire, de longueur maximale 5000
      contenu: { type: DataTypes.STRING(5000), allowNull: false },
    },
    { timestamps: false } // Désactiver la gestion automatique des timestamps
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

// Définition des relations entre les tables
const defineRelations = (models) => {
  // Extraire les modèles depuis l'objet models
  const { Auteur, Categorie, Utilisateur, Editeur, Livre, Laisser, Apprecier } = models;

  // Relations entre Livre et Utilisateur
  Livre.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk" });  
  Utilisateur.hasMany(Livre, { foreignKey: "utilisateur_fk" }); 

  // Relations entre Livre et Editeur
  Livre.belongsTo(Editeur, { foreignKey: "editeur_fk" });  
  Editeur.hasMany(Livre, { foreignKey: "editeur_fk" });  

  // Relations entre Livre et Catégorie
  Livre.belongsTo(Categorie, { foreignKey: "categorie_fk" });  
  Categorie.hasMany(Livre, { foreignKey: "categorie_fk" });  

  // Relations entre Livre et Auteur
  Livre.belongsTo(Auteur, { foreignKey: "auteur_fk" });  
  Auteur.hasMany(Livre, { foreignKey: "auteur_fk" });  

  // Relations entre Laisser (Comment) et Livre
  Laisser.belongsTo(Livre, { foreignKey: "livre_fk" }); 
  Livre.hasMany(Laisser, { foreignKey: "livre_fk" });  

  // Relations entre Laisser (Comment) et Utilisateur
  Laisser.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk" });  
  Utilisateur.hasMany(Laisser, { foreignKey: "utilisateur_fk" });  

  // Relations entre Apprécier (Rating) et Livre
  Apprecier.belongsTo(Livre, { foreignKey: "livre_fk" }); 
  Livre.hasMany(Apprecier, { foreignKey: "livre_fk" });  

  // Relations entre Apprécier (Rating) et Utilisateur
  Apprecier.belongsTo(Utilisateur, { foreignKey: "utilisateur_fk" });  
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

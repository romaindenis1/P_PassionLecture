import { DataTypes } from "sequelize"; // Pour définir les types
import { sequelize } from "../db/sequelize.mjs"; // Instance Sequelize

// Modèle Auteur
const AuteurModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_auteur",
    {
      auteur_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: { type: DataTypes.STRING, allowNull: false },
    },
    { freezeTableName: true, timestamps: false }
  );
};

// Modèle Catégorie
const CategorieModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_categorie",
    {
      categorie_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      libelle: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { tableName: "t_categorie", timestamps: false, freezeTableName: true }
  );
};

// Modèle Utilisateur
const UtilisateurModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_utilisateur",
    {
      utilisateur_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: { msg: "Ce username est déjà pris." },
      },
      hashedPassword: { type: DataTypes.STRING, allowNull: false },
      dateSignup: { type: DataTypes.DATE, allowNull: false },
      isAdmin: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    { tableName: "t_utilisateur", timestamps: false }
  );
};

// Modèle Editeur
const EditeurModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_editeur",
    {
      editeur_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: { type: DataTypes.STRING(50), allowNull: false },
    },
    { freezeTableName: true, tableName: "t_editeur", timestamps: false }
  );
};

// Modèle Livre
const LivreModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_livre",
    {
      livre_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      titre: { type: DataTypes.STRING(255), allowNull: false },
      imageCouverturePath: { type: DataTypes.STRING(255), allowNull: false },
      nbPage: { type: DataTypes.INTEGER, allowNull: false },
      anneeEdition: { type: DataTypes.INTEGER, allowNull: false },
      resume: { type: DataTypes.TEXT, allowNull: true },
      utilisateur_fk: { type: DataTypes.INTEGER, allowNull: true },
      editeur_fk: { type: DataTypes.INTEGER, allowNull: true },
      categorie_fk: { type: DataTypes.INTEGER, allowNull: true },
      auteur_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "t_auteur", key: "auteur_id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    { freezeTableName: true, tableName: "t_livre", timestamps: false }
  );
};

// Modèle Laisser (Commentaire)
const LaisserModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_laisser",
    {
      contenu: { type: DataTypes.STRING(5000), allowNull: true },
      livre_fk: { type: DataTypes.INTEGER, allowNull: true },
      utilisateur_fk: { type: DataTypes.INTEGER, allowNull: true },
    },
    { timestamps: false, freezeTableName: true }
  );
};

// Modèle Apprécier (Notation)
const ApprecierModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_apprecier",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      note: { type: DataTypes.TINYINT, allowNull: false },
      livre_fk: { type: DataTypes.INTEGER, allowNull: false },
      utilisateur_fk: { type: DataTypes.INTEGER, allowNull: false },
    },
    { timestamps: false, freezeTableName: true }
  );
};

// Définition des relations entre modèles
const defineRelations = (models) => {
  const { Auteur, Categorie, Utilisateur, Editeur, Livre, Laisser, Apprecier } =
    models;

  // Livre - Utilisateur
  Livre.belongsTo(Utilisateur, {
    foreignKey: "utilisateur_fk",
    targetKey: "utilisateur_id",
  });
  Utilisateur.hasMany(Livre, { foreignKey: "utilisateur_fk" });

  // Livre - Editeur
  Livre.belongsTo(Editeur, {
    foreignKey: "editeur_fk",
    targetKey: "editeur_id",
  });
  Editeur.hasMany(Livre, { foreignKey: "editeur_fk" });

  // Livre - Catégorie
  Livre.belongsTo(Categorie, {
    foreignKey: "categorie_fk",
    targetKey: "categorie_id",
  });
  Categorie.hasMany(Livre, { foreignKey: "categorie_fk" });

  // Livre - Auteur
  Livre.belongsTo(Auteur, { as: "auteur", foreignKey: "auteur_fk" });
  Auteur.hasMany(Livre, { as: "livres", foreignKey: "auteur_fk" });

  // Laisser - Livre
  Laisser.belongsTo(Livre, { foreignKey: "livre_fk", targetKey: "livre_id" });
  Livre.hasMany(Laisser, { foreignKey: "livre_fk" });

  // Laisser - Utilisateur
  Laisser.belongsTo(Utilisateur, {
    foreignKey: "utilisateur_fk",
    targetKey: "utilisateur_id",
  });
  Utilisateur.hasMany(Laisser, { foreignKey: "utilisateur_fk" });

  // Apprecier - Livre
  Apprecier.belongsTo(Livre, { foreignKey: "livre_fk", targetKey: "livre_id" });
  Livre.hasMany(Apprecier, { foreignKey: "livre_fk" });

  // Apprecier - Utilisateur
  Apprecier.belongsTo(Utilisateur, {
    foreignKey: "utilisateur_fk",
    targetKey: "utilisateur_id",
  });
  Utilisateur.hasMany(Apprecier, { foreignKey: "utilisateur_fk" });
};

// Export des modèles et de la fonction de relations
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

// Modèle Auteur avec validations
const AuteurModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_auteur",
    {
      auteur_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Le nom est obligatoire." },
        },
      },
    },
    { freezeTableName: true, timestamps: false }
  );
};

// Modèle Catégorie avec validations
const CategorieModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_categorie",
    {
      categorie_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Ce libellé existe déjà." },
        validate: {
          notEmpty: { msg: "Le libellé est obligatoire." },
        },
      },
    },
    { tableName: "t_categorie", timestamps: false, freezeTableName: true }
  );
};

// Modèle Utilisateur avec validations
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
        validate: {
          notEmpty: { msg: "Le username est obligatoire." },
          len: {
            args: [1, 50],
            msg: "Le username doit comporter entre 1 et 50 caractères.",
          },
        },
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Le mot de passe est obligatoire." },
        },
      },
      dateSignup: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: { msg: "La date d'inscription doit être une date valide." },
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "Le statut admin est requis." },
        },
      },
    },
    { tableName: "t_utilisateur", timestamps: false }
  );
};

// Modèle Editeur avec validations
const EditeurModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_editeur",
    {
      editeur_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Le nom de l'éditeur est obligatoire." },
          len: {
            args: [1, 50],
            msg: "Le nom de l'éditeur doit comporter entre 1 et 50 caractères.",
          },
        },
      },
    },
    { freezeTableName: true, tableName: "t_editeur", timestamps: false }
  );
};

// Modèle Livre avec validations
const LivreModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_livre",
    {
      livre_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      titre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Le titre est obligatoire." },
          len: {
            args: [1, 255],
            msg: "Le titre doit comporter entre 1 et 255 caractères.",
          },
        },
      },
      imageCouverturePath: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le chemin de l'image de couverture est obligatoire.",
          },
          len: {
            args: [1, 255],
            msg: "Le chemin de l'image de couverture doit comporter entre 1 et 255 caractères.",
          },
        },
      },
      nbPage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Le nombre de pages doit être un entier." },
          min: { args: [1], msg: "Le livre doit avoir au moins 1 page." },
        },
      },
      anneeEdition: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "L'année d'édition doit être un entier." },
        },
      },
      resume: { type: DataTypes.TEXT, allowNull: true },
      utilisateur_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "L'identifiant de l'utilisateur doit être un entier." },
        },
      },
      editeur_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "L'identifiant de l'éditeur doit être un entier." },
        },
      },
      categorie_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "L'identifiant de la catégorie doit être un entier." },
        },
      },
      auteur_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "t_auteur", key: "auteur_id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        validate: {
          isInt: { msg: "L'identifiant de l'auteur doit être un entier." },
        },
      },
    },
    { freezeTableName: true, tableName: "t_livre", timestamps: false }
  );
};

// Modèle Laisser (Commentaire) avec validations
const LaisserModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_laisser",
    {
      contenu: {
        type: DataTypes.STRING(5000),
        allowNull: true,
        validate: {
          len: {
            args: [0, 5000],
            msg: "Le contenu ne peut pas dépasser 5000 caractères.",
          },
        },
      },
      livre_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "L'identifiant du livre doit être un entier." },
        },
      },
      utilisateur_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "L'identifiant de l'utilisateur doit être un entier." },
        },
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};

// Modèle Apprécier (Notation) avec validations
const ApprecierModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_apprecier",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      note: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          isInt: { msg: "La note doit être un entier." },
          min: { args: [0], msg: "La note minimale est 0." },
          max: { args: [10], msg: "La note maximale est 10." },
        },
      },
      livre_fk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "L'identifiant du livre doit être un entier." },
        },
      },
      utilisateur_fk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "L'identifiant de l'utilisateur doit être un entier." },
        },
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};

// Définition des relations entre modèles (inchangée)
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
    as: "categorie",
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

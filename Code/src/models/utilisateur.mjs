import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.mjs"; // Assure-toi que ce chemin est correct

const UtilisateurModel = sequelize.define("Utilisateur", {
  utilisateur_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  hashedPassword: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  dateSignup: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: "t_utilisateur",
  timestamps: false,
});

export { UtilisateurModel };

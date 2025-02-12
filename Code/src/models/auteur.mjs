const AuteurModel = sequelize.define("Auteur", {
  auteur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
});

export {AuteurModel};
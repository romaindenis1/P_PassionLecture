
const EditeurModel = sequelize.define("Editeur", {
  editeur_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
});

export {EditeurModel}
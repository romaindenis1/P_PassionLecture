const CategorieModel = sequelize.define('Categorie', {
    categorie_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 't_categorie',
    timestamps: false
  });

  export {CategorieModel};
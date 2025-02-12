
const LivreModel = sequelize.define('Livre', {
    livre_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    imageCouverturePath: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nbPage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lien: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    resume: {
      type: DataTypes.STRING(3000),
      allowNull: false
    },
    anneeEdition: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  }, {
    tableName: 't_livre',
    timestamps: false
  });

  export {LivreModel};
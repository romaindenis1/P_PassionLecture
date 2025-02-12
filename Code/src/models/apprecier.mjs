const ApprecierModel = sequelize.define("Apprecier", {
    note: { type: DataTypes.TINYINT, allowNull: false },
  }, { timestamps: false });

export {ApprecierModel}
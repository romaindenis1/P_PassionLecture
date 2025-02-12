const CommenterModel = sequelize.define("Commenter", 
    {
    contenu: { type: DataTypes.STRING(5000), allowNull: false },
    }, 
    { timestamps: false });

export {CommenterModel}
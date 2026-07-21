   
module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING
        },
        title:{
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.TINYINT
        }
    }, 
    {
        timestamps: true
    });
    return Category;
}; 
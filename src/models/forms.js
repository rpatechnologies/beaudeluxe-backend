module.exports = (sequelize, Sequelize) => {
    const Forms = sequelize.define("forms", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        }
    }, 
    {
        timestamps: true
    });

    return Forms;
};
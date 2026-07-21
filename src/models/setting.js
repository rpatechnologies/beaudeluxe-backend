module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define("settings", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        field: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.TEXT
        },
    }, 
    {
        timestamps: true
    });
    return Setting;
};
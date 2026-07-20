module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admins", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        contact_number: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        avatar: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });
    return Admin;
};
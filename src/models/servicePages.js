module.exports = (sequelize, Sequelize) => {
    const ServicePages = sequelize.define("service_pages", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        for_main: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });

    return ServicePages;
};
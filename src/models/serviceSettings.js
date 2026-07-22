   
module.exports = (sequelize, Sequelize) => {
    const ServiceSettings = sequelize.define("service_settings", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        serviceTitleId:{
            type: Sequelize.STRING
        },
        title: {
            type: Sequelize.STRING
        },
        shadow_title: {
            type: Sequelize.STRING
        },
        for_main: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });
    return ServiceSettings;
}; 
module.exports = (sequelize, Sequelize) => {
    const FormServices = sequelize.define("form_services", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        form_id: {
            type: Sequelize.STRING
        },
        service_id:{
            type: Sequelize.INTEGER
        },
        subservice_id:{
            type: Sequelize.INTEGER
        },
        subservice_price_id:{
            type: Sequelize.INTEGER
        },
        service_title:{
            type: Sequelize.STRING
        },
        sub_service_title:{
            type: Sequelize.STRING
        },
        sub_service_price_title:{
            type: Sequelize.STRING
        },
        sub_service_price:{
            type: Sequelize.FLOAT
        }
    }, 
    {
        timestamps: true
    });

    return FormServices;
};
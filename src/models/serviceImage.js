   
module.exports = (sequelize, Sequelize) => {
    const ServiceImage = sequelize.define("service_images", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        service_id: {
            type: Sequelize.INTEGER
        },
        image: {
            type: Sequelize.STRING
        },
        order_no: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });
    return ServiceImage;
};  
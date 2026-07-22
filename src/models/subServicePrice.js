module.exports = (sequelize, Sequelize) => {
    const SubServicePrices = sequelize.define("subservice_prices", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        subservice_id: {
            type: Sequelize.INTEGER
        },
        category_id:{
            type: Sequelize.INTEGER
        },
        title:{
            type: Sequelize.TEXT
        },
        price: {
            type: Sequelize.TEXT
        },
    }, 
    {
        timestamps: true
    });
    return SubServicePrices;
};  
   
module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("countries", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        phone: {
            type: Sequelize.INTEGER
        },
        code: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        symbol: {
            type: Sequelize.STRING
        },
        capital: {
            type: Sequelize.STRING
        },
        currency: {
            type: Sequelize.STRING
        },
        continent: {
            type: Sequelize.STRING
        },
        continent_code: {
            type: Sequelize.STRING
        },
        latitude: {
            type: Sequelize.STRING
        },
        longitude: {
            type: Sequelize.STRING
        }
    }, 
    {
        timestamps: true
    });
    return Country;
}; 
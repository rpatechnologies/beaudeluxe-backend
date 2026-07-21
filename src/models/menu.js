   
module.exports = (sequelize, Sequelize) => {
    const Menu = sequelize.define("menus", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        type: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        isMobile: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER
        },
        slug: {
            type: Sequelize.STRING
        }
    }, 
    {
        timestamps: true
    });
    return Menu;
}; 
module.exports = (sequelize, Sequelize) => {
    const HomePageContents = sequelize.define("home_page_contents", {
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
    return HomePageContents;
};
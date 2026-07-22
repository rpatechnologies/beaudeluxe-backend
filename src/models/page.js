module.exports = (sequelize, Sequelize) => {
    const Page = sequelize.define("pages", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        slug: {
            type: Sequelize.STRING
        }
    }, 
    {
        timestamps: true
    });

    return Page;
};
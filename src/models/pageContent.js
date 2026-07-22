   
module.exports = (sequelize, Sequelize) => {
    const pageContent = sequelize.define("page_contents", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        page_id: {
            type: Sequelize.INTEGER
        },
        heading: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });
    return pageContent;
}; 
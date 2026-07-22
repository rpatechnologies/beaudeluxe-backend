module.exports = (sequelize, Sequelize) => {
    const Blogs = sequelize.define("blogs", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING
        },
        short_description: {
            type: Sequelize.TEXT
        },
        date: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
        altTag: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.INTEGER
        },
        related_blogs: {
            type: Sequelize.STRING
        },
        slug: {
            type: Sequelize.STRING
        },
    }, 
    {
        timestamps: true
    });
    return Blogs;
}; 
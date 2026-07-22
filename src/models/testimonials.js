   module.exports = (sequelize, Sequelize) => {
    const Testimonials = sequelize.define("testimonials", {
        // id, name, country, rating, description, photo, altTag, status, publishedAt
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.STRING
        },
        flag: {
            type: Sequelize.STRING
        },
        rating:{
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.TEXT
        },
        photo: {
            type: Sequelize.STRING
        },
        slug: {
            type: Sequelize.STRING
        },
        altTag: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
    }, 
    {
        timestamps: true
    });
    return Testimonials;
}; 
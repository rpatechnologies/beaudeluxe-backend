    
module.exports = (sequelize, Sequelize) => {
    const About = sequelize.define("abouts", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        image: {
            type: Sequelize.STRING
        },
        altTag: {
            type: Sequelize.STRING
        },
        methodology: {
            type: Sequelize.TEXT
        },
        methodology_bg_img: {
            type: Sequelize.STRING
        },
        altTagMethodlology: {
            type: Sequelize.STRING
        }
    }, 
    {
        timestamps: true
    });
    return About;
}; 
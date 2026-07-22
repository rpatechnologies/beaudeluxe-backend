  
module.exports = (sequelize, Sequelize) => {
    const Cms = sequelize.define("cms", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        // page_id: {
        //     type: Sequelize.INTEGER
        // },
        banner_heading: {
            type: Sequelize.STRING
        },
        title: {
            type: Sequelize.STRING
        },
        shadow_title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        image: {
            type: Sequelize.STRING
        },
        alt_tag: {
            type: Sequelize.STRING
        },
        // image_mob: {
        //     type: Sequelize.STRING
        // },
        // alt_tag_mob: {
        //     type: Sequelize.STRING
        // },
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
    return Cms;
}; 
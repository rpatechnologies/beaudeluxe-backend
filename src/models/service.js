   
module.exports = (sequelize, Sequelize) => {
    const Service = sequelize.define("services", {
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
        order_number:{
            type:Sequelize.INTEGER
        },
        heading: {
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
        logo: {
            type: Sequelize.STRING
        },
        sub_services_description:{
            type: Sequelize.STRING
        },
        altTagLogo: {
            type: Sequelize.STRING
        },
        banner: {
            type: Sequelize.STRING
        },
        altTagBanner:{type: Sequelize.STRING},
        banner_mob: {
            type: Sequelize.STRING
        },
        altTagBannerMob:{type: Sequelize.STRING},
        details_heading: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.TINYINT
        },
        meta_title: {
            type: Sequelize.STRING
        },
        meta_description: {
            type: Sequelize.TEXT
        },
        meta_keywords: {
            type: Sequelize.STRING
        },
        slug: {
            type: Sequelize.STRING
        },
        show_in_menu: {
            type: Sequelize.INTEGER
        },
        show_on_home: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });
    return Service;
}; 
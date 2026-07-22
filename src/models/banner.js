  
module.exports = (sequelize, Sequelize) => {
    const Banner = sequelize.define("banners", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        page_id: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
        altTagImage: {
            type: Sequelize.STRING
        },
        image_mob: {
            type: Sequelize.STRING
        },
        altTagImageMob: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        order_no: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });
    return Banner;
}; 
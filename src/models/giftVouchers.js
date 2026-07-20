module.exports = (sequelize, Sequelize) => {
    const GiftVoucher = sequelize.define("gift_vouchers", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING
        },
        description:{
            type: Sequelize.TEXT
        },
        image:{
            type: Sequelize.STRING
        },
        status:{
            type: Sequelize.TINYINT
        }
    }, 
    {
        timestamps: true
    });

    return GiftVoucher;
};
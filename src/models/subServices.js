module.exports = (sequelize, Sequelize) => {
    const SubServices = sequelize.define("sub_services", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        service_id: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.TEXT
        },
        description:{
            type: Sequelize.TEXT
        },
        type:{
            type: Sequelize.STRING
        },
        // answer: {
        //     type: Sequelize.TEXT
        // },
        slug: {
           type: Sequelize.STRING
        },
        order_no: {
            type: Sequelize.INTEGER
        },
        status:{
            type: Sequelize.TINYINT
        }
    }, 
    {
        timestamps: true
    });
    return SubServices;
};
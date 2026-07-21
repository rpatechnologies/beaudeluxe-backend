module.exports = (sequelize, Sequelize) => {
    const ServiceFaq = sequelize.define("service_faq", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        service_id: {
            type: Sequelize.INTEGER
        },
        question: {
            type: Sequelize.TEXT
        },
        answer: {
            type: Sequelize.TEXT
        },
        show_in_main: {
            type: Sequelize.INTEGER
        },
        order_no: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });
    return ServiceFaq;
}; 
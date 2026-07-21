module.exports = (sequelize, Sequelize) => {
    const Faq = sequelize.define("faqs", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        question: {
            type: Sequelize.STRING
        },
        answer:{
            type: Sequelize.TEXT                                                                                                                                                                                                                                                  
        },
        slug:{
            type:Sequelize.STRING
        },
        show_on_homepage:{
            type: Sequelize.TINYINT
        },
        status:{
            type: Sequelize.TINYINT
        }
    }, 
    {
        timestamps: true
    });

    return Faq;
};
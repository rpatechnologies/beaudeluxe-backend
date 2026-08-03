   
module.exports = (sequelize, Sequelize) => {
    const formAppointment = sequelize.define("form_appointments", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        email_address: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        address:{
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.INTEGER
        },
        slot: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.FLOAT
        },
        gender: {
            type: Sequelize.STRING
        },
    }, 
    {
        timestamps: true
    });
    return formAppointment
    ;
}; 
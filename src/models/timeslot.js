   
module.exports = (sequelize, Sequelize) => {
    const TimeSlot = sequelize.define("time_slots", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title:{
            type: Sequelize.STRING,
        },
        start_date: {
            type: Sequelize.STRING
        },
        end_date: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.TINYINT
        }   
    }, 
    {
        timestamps: true
    });
    return TimeSlot;
};  
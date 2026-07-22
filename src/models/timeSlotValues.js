   
module.exports = (sequelize, Sequelize) => {
    const TimeSlotValue = sequelize.define("timeslot_values", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        time_slot_id: {
            type: Sequelize.INTEGER
        },
        date: {
            type: Sequelize.STRING
        },
        start_time:{
            type: Sequelize.TIME
        },
        end_time: {
            type: Sequelize.TIME
        }   
    }, 
    {
        timestamps: true
    });
    return TimeSlotValue;
};  
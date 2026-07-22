module.exports = (sequelize, Sequelize) => {
    const Therapist = sequelize.define("therapists", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        designation: {
            type: Sequelize.STRING
        },
        experience: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
        altTag: {
            type: Sequelize.STRING
        },
        specializations: {
            type: Sequelize.TEXT
        },
        certifications: {
            type: Sequelize.TEXT
        },
        order_number: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    }, {
        timestamps: true
    });
    return Therapist;
};

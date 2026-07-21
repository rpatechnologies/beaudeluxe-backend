module.exports = (sequelize, Sequelize) => {
    const EmailTemplate = sequelize.define("email_templates", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING
        },
        from_name: {
            type: Sequelize.STRING
        },
        from_email: {
            type: Sequelize.STRING
        },
        subject: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.INTEGER
        }
    }, 
    {
        timestamps: true
    });
    return EmailTemplate;
};
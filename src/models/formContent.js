   
module.exports = (sequelize, Sequelize) => {
    const formContent = sequelize.define("form_contents", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        page_id: {
            type: Sequelize.INTEGER
        },
        // form: {
        //     type: Sequelize.STRING
        // },
        title: {
            type: Sequelize.STRING
        },
        shadow_title: {
            type: Sequelize.STRING
        },
        location_label: {
            type: Sequelize.STRING
        },
        // description: {
        //     type: Sequelize.TEXT
        // },
        name_label: {
            type: Sequelize.STRING
        },
        phone_label: {
            type: Sequelize.STRING
        },
        email_label: {
            type: Sequelize.STRING
        },
        date_label: {
            type: Sequelize.STRING
            // type: Sequelize.DATE
        }, 
        slot_label: {
            type: Sequelize.STRING
        },
        service_section_label: {
            type: Sequelize.STRING
        },
        service_label: {
            type: Sequelize.STRING
        },
        subservice_label: {
            type: Sequelize.STRING
        },
    }, 
    {
        timestamps: true
    });
    return formContent;
}; 
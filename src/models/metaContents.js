module.exports = (sequelize, Sequelize) => {
    const MetaContents = sequelize.define("meta_contents", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        // page_id: {
        //     type: Sequelize.INTEGER
        // },
        metaTitle: {
            type: Sequelize.STRING
        },
        metaDescription: {
            type: Sequelize.STRING
        },
        metaKeywords:{
            type: Sequelize.STRING
        },
        h1:{
            type: Sequelize.STRING
        },
        h2:{
            type: Sequelize.STRING
        },
        slug:{
            type: Sequelize.STRING
        }
        
    }, 
    {
        timestamps: true
    });
    return MetaContents;
}; 
const Sequelize = require("sequelize");
const dbSequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    logging: false, 
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
 
module.exports = dbSequelize;
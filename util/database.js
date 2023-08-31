const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost',
    timezone: 'Asia/Kolkata'
});

module.exports = sequelize;
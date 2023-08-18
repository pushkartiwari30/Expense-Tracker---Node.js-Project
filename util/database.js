const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'mysql@3001', {
    dialect: 'mysql',
    host: 'localhost',
    timezone: 'Asia/Kolkata'
});

module.exports = sequelize;
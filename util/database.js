const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'mysql@3001', {
    dialect: 'mysql',
    host: 'localhost'
});


module.exports = sequelize;
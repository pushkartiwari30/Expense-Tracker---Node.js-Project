const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Income = sequelize.define('income',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amountInc: Sequelize.DOUBLE,
    description: Sequelize.STRING,
    category: Sequelize.STRING

});
module.exports = Income
const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'amit', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database'); // Update with your Sequelize instance

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Assuming 'Users' table exists
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('processing', 'success', 'failure'),
        allowNull: false,
        defaultValue: 'processing',
    },
});

module.exports = Payment;

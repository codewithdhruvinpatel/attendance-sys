const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('employee', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  password: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: 'employee' }
});

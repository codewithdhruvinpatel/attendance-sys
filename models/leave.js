const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('leave', {
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  type: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: 'pending' }
  
});

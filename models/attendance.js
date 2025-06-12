const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('attendance', {
  date: DataTypes.DATEONLY,
  punchIn: DataTypes.TIME,
  punchOut: DataTypes.TIME,
  inPhoto: DataTypes.BLOB('long'),
  outPhoto: DataTypes.BLOB('long')
});

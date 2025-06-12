const sequelize = require('../config/db');
const Employee = require('./employee');
const Attendance = require('./attendance');
const Leave = require('./leave');

Employee.hasMany(Attendance);
Attendance.belongsTo(Employee);

Employee.hasMany(Leave);
Leave.belongsTo(Employee);

module.exports = { sequelize, Employee, Attendance, Leave };

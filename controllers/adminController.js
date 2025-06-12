// controllers/adminController.js
import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import { Employee, Attendance, Leave } from '../models/index.js'; // Ensure index.js uses ES exports

// Dashboard controller
export const adminDashboard = async (req, res) => {
  const emps = await Employee.findAll();
  const atts = await Attendance.findAll({ include: Employee });
  const leaves = await Leave.findAll({ include: Employee });
  const top = await Attendance.findAll({
    attributes: ['employeeId', [Sequelize.fn('COUNT', 'id'), 'count']],
    group: ['employeeId'],
    order: [[Sequelize.literal('count'), 'DESC']],
    limit: 5
  });

  // If you want to include full attendance log in the admin view:
  const allAttendance = await Attendance.findAll({
    include: [{ model: Employee }],
    order: [['date', 'DESC']],
  });

  res.render('admin', { emps, atts, leaves, top, allAttendance , user: req.user });
};

// Add new employee
export const addEmployee = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const pw = await bcrypt.hash(password, 10);
  await Employee.create({ name, email, phone, password: pw, role: 'employee' });
  res.redirect('/admin');
};

// Approve or reject leave
export const manageLeaves = async (req, res) => {
  const { id, action } = req.params;
  const leave = await Leave.findByPk(id);
  if (leave) {
    leave.status = action;
    await leave.save();
  }
  res.redirect('/admin');
};

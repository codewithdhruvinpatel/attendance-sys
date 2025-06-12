const bcrypt = require('bcrypt');
const { Employee } = require('../models');

exports.registerUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await Employee.create({ name, email, phone, password: hash, role });
  res.redirect('/login');
};

exports.logoutUser = (req, res) => {
  req.logout(() => res.redirect('/login'));
};

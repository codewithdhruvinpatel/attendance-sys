const { Attendance, Leave } = require('../models');

exports.punch = async (req, res) => {
  if (req.method === 'GET') return res.render('punch');
  const isIn = req.body.type === 'in';
  const buf = req.file.buffer;
  const today = new Date().toISOString().slice(0,10);
  let att = await Attendance.findOne({ where: { employeeId: req.user.id, date: today } });
  if (!att) att = await Attendance.create({ employeeId: req.user.id, date: today });
  if (isIn) att.punchIn = new Date().toLocaleTimeString(), att.inPhoto = buf;
  else att.punchOut = new Date().toLocaleTimeString(), att.outPhoto = buf;
  await att.save();
  res.redirect('/employee/dashboard');
};

exports.dashboard = async (req, res) => {
  const atts = await Attendance.findAll({ where: { employeeId: req.user.id } });
  const leaves = await Leave.findAll({ where: { employeeId: req.user.id } });
 

  res.render('dashboard', { user: req.user, atts, leaves , user: req.user });
};

exports.applyLeave = async (req, res) => {
  await Leave.create({
    employeeId: req.user.id,
    startDate: req.body.start,
    endDate: req.body.end,
    type: req.body.type
  });
  res.redirect('/employee/dashboard');
};

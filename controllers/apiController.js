const { Attendance } = require('../models');

exports.apiAttendance = async (req, res) => {
  const { employeeId, month } = req.query;
  const atts = await Attendance.findAll({
    where: { employeeId, date: { [require('sequelize').Op.iLike]: `${month}-%` } }
  });
  res.json(atts);
};

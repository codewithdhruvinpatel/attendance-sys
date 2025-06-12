require('dotenv').config();
const cron = require('node-cron');
const { Attendance, sequelize } = require('./models');
const { Op } = require('sequelize');

cron.schedule('0 0 * * *', async () => {
  console.log('🌙 Removing old photos...');
  await sequelize.query(
    `UPDATE attendances SET inPhoto = NULL, outPhoto = NULL WHERE date < NOW() - INTERVAL '30 days'`
  );
});

cron.schedule('30 12 * * *', async () => {
  const today = new Date().toISOString().slice(0,10);
  const absent = await sequelize.query(
    `SELECT e.phone, e.name FROM employees e
     LEFT JOIN attendances a ON e.id=a.employeeId AND a.date='${today}'
     WHERE e.role='employee' AND a.id IS NULL`
  );
  const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  absent[0].forEach(u => {
    twilio.messages.create({
      to: u.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `Hi ${u.name}, you haven’t punched in today. Please do so.`
    });
  });
});

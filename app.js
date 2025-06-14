require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const passport = require('passport');
const { sequelize } = require('./models');
const db = require('./config/db');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const adminRoutes = require('./routes/admin');


require('./passport-config')(passport);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// function to generate a random secret key
const generateSecret = () => {
  return require('crypto').randomBytes(64).toString('hex');
};
const secret = generateSecret();
app.use(
  session({
    store: new pgSession({ conString: process.env.DATABASE_URL }),
    secret: secret,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);

app.get('/api', async (req, res) => {
  try {
    // Fetch all required data in parallel
    const [employeesResult, attendancesResult, leavesResult] = await Promise.all([
      db.query('SELECT * FROM employees'),
      db.query('SELECT * FROM attendances'),
      db.query('SELECT * FROM leaves'),
    ]);

    const employees = employeesResult[0];
    const attendances = attendancesResult[0];
    const leaves = leavesResult[0];

    console.log('Total Attendance Records:', attendances.length);
    attendances.forEach(att => {
      console.log(`Attendance Record - Employee ID: ${att.employeeId}, Date: ${att.date}, Status: ${att.status}`);
    });

    console.log('Total Leave Records:', leaves.length);

    // Construct the response with attendance count per employee
    const employeeData = employees.map(emp => {
      const empAttendanceCount = attendances.filter(att => att.employeeId === emp.id).length;

      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        totalAttendance: empAttendanceCount
      };
    });

    res.json({
      message: 'Welcome to the Employee Management System API',
      dbStatus: 'Connected',
      totalEmployees: employees.length,
      totalAdmins: employees.filter(emp => emp.role === 'admin').length,
      employees: employeeData
    });

  } catch (err) {
    console.error('Error in /api:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => console.log(`💼 Server started on port ${process.env.PORT}`));
});

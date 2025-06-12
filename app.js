require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const passport = require('passport');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

require('./passport-config')(passport);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    store: new pgSession({ conString: process.env.DATABASE_URL }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => console.log(`💼 Server started on port ${process.env.PORT}`));
});

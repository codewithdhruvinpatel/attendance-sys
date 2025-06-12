const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Employee } = require('./models');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, pwd, done) => {
    try {
      const user = await Employee.findOne({ where: { email } });
      if (!user) return done(null, false, { message: 'No user' });
      const match = await bcrypt.compare(pwd, user.password);
      if (!match) return done(null, false, { message: 'Wrong password' });
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }));
  passport.serializeUser((u, done) => done(null, u.id));
  passport.deserializeUser(async (id, done) => {
    const user = await Employee.findByPk(id);
    done(null, user);
  });
};

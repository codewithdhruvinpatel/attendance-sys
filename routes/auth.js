const express = require('express');
const passport = require('passport');
const { registerUser, logoutUser } = require('../controllers/authController');
const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/redirect',
    failureRedirect: '/login'
  }));
router.get('/register', (req, res) => res.render('register'));
router.post('/register', registerUser);
router.get('/redirect', (req, res) => {
  if (req.user.role === 'admin') return res.redirect('/admin');
  res.redirect('/employee/dashboard');
});
router.get('/logout', logoutUser);

module.exports = router;

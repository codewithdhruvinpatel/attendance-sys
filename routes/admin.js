const express = require('express');
const { ensureAuth, ensureAdmin } = require('../middlewares/auth');
const { adminDashboard, addEmployee, manageLeaves } = require('../controllers/adminController');
const router = express.Router();

router.use(ensureAuth, ensureAdmin);

router.get('/', adminDashboard);
router.post('/add', addEmployee);
router.post('/leave/:id/:action', manageLeaves);

module.exports = router;

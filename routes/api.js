const express = require('express');
const { apiAttendance } = require('../controllers/apiController');
const router = express.Router();

router.get('/attendance', apiAttendance);

module.exports = router;

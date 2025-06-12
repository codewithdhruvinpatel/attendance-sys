const express = require('express');
const multer = require('multer');
const { ensureAuth } = require('../middlewares/auth');
const { punch, dashboard, applyLeave } = require('../controllers/employeeController');
const upload = multer();

const router = express.Router();
router.use(ensureAuth);

router.get('/dashboard', dashboard);
router.get('/punch', punch);
router.post('/punch', upload.single('photo'), punch);
router.post('/leave', applyLeave);

module.exports = router;

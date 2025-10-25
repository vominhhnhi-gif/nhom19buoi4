const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const logController = require('../controllers/logController');

// Admin-only: view logs
router.get('/logs', auth, requireRole('admin'), logController.getLogs);

module.exports = router;

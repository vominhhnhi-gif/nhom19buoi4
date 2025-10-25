const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers'); // đúng tên file
const loginRateLimit = require('../middleware/loginRateLimit');
const { logActivity } = require('../middleware/logActivity');

router.post('/signup', logActivity('signup'), authController.signup);
// Apply rate limiter and log activity for login
router.post('/login', loginRateLimit(), logActivity('login_attempt'), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
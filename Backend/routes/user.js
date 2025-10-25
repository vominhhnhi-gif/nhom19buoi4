const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const multer = require('multer');

// Multer memory storage for small images
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Admin-only: list users
router.get('/', auth, requireRole('admin'), controller.getUsers);
// Public: create user (signup)
router.post('/', controller.createUser);
// Admin-only: update any user
router.put('/:id', auth, requireRole('admin'), controller.updateUser); // PUT
// Delete: admin or self (controller will check)
router.delete('/:id', auth, controller.deleteUser); // DELETE

// Upload avatar (authenticated users)
router.post('/avatar', auth, upload.single('avatar'), controller.uploadAvatarFile);

module.exports = router;
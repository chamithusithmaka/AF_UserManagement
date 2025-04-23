// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, updateProfile, changePassword, deleteAccount} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (authentication required)
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.delete('/', protect, deleteAccount);

module.exports = router;

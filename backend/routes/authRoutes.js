// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, updateProfile, changePassword, deleteAccount} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.delete('/', deleteAccount);

module.exports = router;

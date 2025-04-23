// backend/routes/favoriteRoutes.js
const express = require('express');
const { getFavorites, updateFavorites } = require('../controllers/favoritesController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Routes
router.get('/', getFavorites);
router.post('/', updateFavorites);

module.exports = router;
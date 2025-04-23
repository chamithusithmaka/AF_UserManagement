// backend/models/Favorites.js
const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  countries: [{
    type: String, // country code (cca3)
    required: true
  }]
}, { timestamps: true });

// Create a compound index to ensure a user can't have duplicate entries
favoritesSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Favorites', favoritesSchema);
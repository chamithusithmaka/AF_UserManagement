// backend/controllers/favoritesController.js
const Favorites = require('../models/Favorites');

// Get favorites for a user
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorites.findOne({ user: req.user._id });
    res.json({ countries: favorites ? favorites.countries : [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update favorites (add or remove country)
exports.updateFavorites = async (req, res) => {
  const { countryCode, action } = req.body;

  if (!countryCode || !['add', 'remove'].includes(action)) {
    return res.status(400).json({ message: 'Invalid request. Please provide a country code and valid action (add/remove)' });
  }

  try {
    // Find user's favorites document
    let favorites = await Favorites.findOne({ user: req.user._id });

    if (!favorites && action === 'add') {
      // Create new favorites document if it doesn't exist
      favorites = new Favorites({
        user: req.user._id,
        countries: [countryCode]
      });
      await favorites.save();
      return res.status(201).json({ message: 'Country added to favorites', countries: favorites.countries });
    }

    if (!favorites && action === 'remove') {
      return res.status(404).json({ message: 'No favorites found for this user' });
    }

    if (action === 'add' && !favorites.countries.includes(countryCode)) {
      favorites.countries.push(countryCode);
    } else if (action === 'remove') {
      favorites.countries = favorites.countries.filter(code => code !== countryCode);
    }

    await favorites.save();
    return res.status(200).json({ 
      message: action === 'add' ? 'Country added to favorites' : 'Country removed from favorites',
      countries: favorites.countries
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
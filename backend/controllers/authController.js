// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Favorites = require('../models/Favorites');


const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    if (!username && !email) {
      return res.status(400).json({ message: 'No update data provided' });
    }
    
    // Check if email is already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    // Check if username is already taken
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Profile updated successfully', 
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Get user with password
    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    // Delete user's favorites
    await Favorites.deleteMany({ user: req.user._id });
    
    // Delete the user
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

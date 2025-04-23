const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// App initialization
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Local development URL
  'http://localhost:3000', // Alternative local URL (if needed)
  'https://stirring-starship-06c468.netlify.app', // Production frontend URL
  'https://afusermanagement-production.up.railway.app' // Backend URL (for same-origin requests)
];

const corsOptions = {
  origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow no origin for direct calls (like Postman)
          callback(null, true);
      } else {
          console.log('Blocked origin:', origin); // Log blocked origins for debugging
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS explicitly
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // Use the CORS middleware with the defined options

// Remove the custom CORS middleware that was here

app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// Add this below the existing routes
const favoriteRoutes = require('./routes/favoriteRoutes');
app.use('/api/favorites', favoriteRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`✅ MongoDB connected successfully`);
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
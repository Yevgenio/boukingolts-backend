const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Apply logging middleware
// app.set('trust proxy', true); // Trust AWS proxy to get real IP address

//const { verifyToken } = require('./middleware/auth.middleware');
// app.use(verifyToken); // Ensure the user is authenticated first

const logRequest = require('./middleware/log.middleware');
app.use(logRequest); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// Root Route
app.get('/api', (req, res) => {
  res.send('Student 7 API');
});

// Set CORS headers for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow headers
  next();
});

// Log Routes
const logRoutes = require('./routes/log.routes');
app.use('/api/logs', logRoutes);

// Authentication Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// User Routes
const userRoutes = require('./routes/user.routes');
app.use('/api/user', userRoutes);

// Chat Routes
const chatRoutes = require('./routes/chat.routes');
app.use('/api/chats', chatRoutes);

// Product Routes
const dealRoutes = require('./routes/product.routes');
app.use('/api/deals', dealRoutes);

// Memo Routes
const memoRoutes = require('./routes/memo.routes');
app.use('/api/memos', memoRoutes);

// Search Routes
const searchRoutes = require('./routes/search.routes');
app.use('/api/search', searchRoutes);

// Image file Routes
const fileRoutes = require('./routes/file.routes');
app.use('/api/uploads', fileRoutes);

const passport = require('passport');
require('./config/google.strategy'); // Load the Google strategy
app.use(passport.initialize());

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

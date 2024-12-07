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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Sample Route
app.get('/', (req, res) => {
  res.send('Student 7 API');
});

// Authentication Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// User Routes
const userRoutes = require('./routes/user.routes');
app.use('/api/user', userRoutes);

// Product Routes
const chatRoutes = require('./routes/chat.routes');
app.use('/api/chats', chatRoutes);

// Product Routes
const dealRoutes = require('./routes/deal.routes');
app.use('/api/deals', dealRoutes);

// Image file Routes
const fileRoutes = require('./routes/file.routes');
app.use('/api/uploads', fileRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

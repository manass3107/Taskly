const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow both local and deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://taskly-gold.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/UserRoutes');
const profileRoutes = require('./routes/profileRoutes');
const taskRoutes = require('./routes/taskRoutes');
const offerRoutes = require('./routes/offerRoutes');
const contractRoutes = require('./routes/contractRoutes');
const authMiddleware = require('./middleware/auth');

// ✅ Public Routes
app.use('/api/auth', authRoutes);

// ✅ Protected Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/offers', authMiddleware, offerRoutes);
app.use('/api/contracts', authMiddleware, contractRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Taskly API is running');
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Connect MongoDB and Start Server
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if DB fails
  });

// Graceful error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

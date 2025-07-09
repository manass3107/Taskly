const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Get current user's profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile (name/email)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Profile update failed' });
  }
});

module.exports = router;

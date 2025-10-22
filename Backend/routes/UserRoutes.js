const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Offer = require('../models/Offer');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// 🚫 TEST ONLY: List all users (Disable/remove in production)
router.get('/', async (req, res) => {
  try {
    console.log("Fetching user ID:", req.params.id);
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 GET user analytics (dashboard metrics)
router.get('/analytics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let taskCount = 0;
    let offerCount = 0;
    let acceptedOffers = 0;

    if (user.role === 'poster') {
      taskCount = await Task.countDocuments({ postedBy: user._id });
    }

    if (user.role === 'worker') {
      [offerCount, acceptedOffers] = await Promise.all([
        Offer.countDocuments({ offeredBy: user._id }),
        Offer.countDocuments({ offeredBy: user._id, status: 'accepted' })
      ]);
    }

    const transactions = Array.isArray(user.transactions) ? user.transactions : [];

    const totalEarned = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      role: user.role,
      walletBalance: user.walletBalance,
      taskCount,
      offerCount,
      acceptedOffers,
      totalEarned,
      totalSpent
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// POST wallet top-up
router.post('/topup', auth, async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) 
    {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.walletBalance += amount;
    user.transactions.push({
      type: 'funding',
      amount,
      reason: 'Wallet top-up',
      date: new Date()
    });

    await user.save();
    res.json({ walletBalance: user.walletBalance, message: 'Top-up successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during top-up' });
  }
});

// GET user transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.transactions || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch('/switch-role', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Toggle between 'worker' and 'poster'
    user.role = user.role === 'worker' ? 'poster' : 'worker';
    await user.save();

    // ✅ Issue new token with updated role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      message: `Role switched to ${user.role}`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id/switch-role', auth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      message: 'Role updated successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // ✅ Correct ObjectId validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;

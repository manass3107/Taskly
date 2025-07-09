const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['poster', 'worker', 'admin'],
    default: 'worker'
  },
  skills: {
    type: [String], // e.g., ['frontend', 'backend', 'nodejs', 'mongodb']
    default: []
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['debit', 'credit', 'funding'],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      reason: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

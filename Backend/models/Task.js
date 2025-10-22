const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  componentType: {
    type: String,
    enum: ['Backend', 'Frontend', 'Database', 'Deployment','Full Stack'],
    required: true
  },
  participationFee: {
    type: Number,
    required: true,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer'
    }
  ],
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'disputed', 'closed'],
    default: 'open'
  },
  budget: { type: Number, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completionRequested: { type: Boolean, default: false }
}, { _id: false });

const contractSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  acceptedOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  paymentTerms: {
    type: String,
    enum: ['quarter', 'half', 'full'],
    required: true
  },
  milestones: [milestoneSchema],
  disputeRaised: {
    type: Boolean,
    default: false
  },
  disputeReason: {
    type: String
  },
  disputeBy: {
    type: String,
    enum: ['poster', 'worker'], 
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);

const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    default: null
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  evidence: {
    type: String,
    trim: true,
    default: ''
  }, // You can treat this as an optional image/pdf URL or file path
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  },
  adminDecision: {
    type: String,
    default: '',
    trim: true
  }
}, { timestamps: true }); // adds createdAt + updatedAt

module.exports = mongoose.model('SupportTicket', supportTicketSchema);

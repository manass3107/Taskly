const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const Contract = require('../models/Contract');


// ✅ Accept an offer by offerId
router.post('/:offerId/accept', authMiddleware, async (req, res) => {
  try {
    const { offerId } = req.params;
    const { paymentTerms } = req.body;

    // Only posters can accept offers
    if (req.user.role !== 'poster') {
      return res.status(403).json({ error: 'Only posters can accept offers' });
    }

    const offer = await Offer.findById(offerId).populate('taskId offeredBy');
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    const task = offer.taskId;

    if (!task || task.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to accept this offer' });
    }

    // Check if a contract already exists for this task
    const existingContract = await require('../models/Contract').findOne({ task: task._id });
    if (existingContract) {
      return res.status(400).json({ error: 'A contract has already been created for this task' });
    }

    console.log('Creating contract with:', {
    taskId: task._id,
    acceptedOffer: offer._id,
    paymentTerms
  });
  let milestones = [];

    if (paymentTerms === 'quarter') {
      milestones = [
        { stage: '25%', description: 'First milestone' },
        { stage: '50%', description: 'Second milestone' },
        { stage: '75%', description: 'Third milestone' },
        { stage: '100%', description: 'Final milestone' },
      ];
    } else if (paymentTerms === 'half') {
      milestones = [
        { stage: '50%', description: 'First half' },
        { stage: '100%', description: 'Final half' },
      ];
    } else if (paymentTerms === 'full') {
      milestones = [
        { stage: '100%', description: 'Full payment after completion' },
      ];
    }

  const contract = new Contract({
    taskId: task._id,
    acceptedOffer: offer._id,
    paymentTerms,
    milestones
  });

  await contract.save();

  res.status(200).json({ message: 'Offer accepted and contract created', contract });

  } catch (err) {
    console.error('Error in accept-offer:', err);
    res.status(500).json({ error: 'Server error while accepting offer' });
  }
});



// Poster views all offers for a specific task
router.get('/task/:taskId', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    if (task.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized to view offers for this task.' });
    }

    const offers = await Offer.find({ taskId }).populate('offeredBy', 'name email');
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Worker applies an offer on a task
router.post('/:taskId/apply-offer', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'Only workers can apply for offers' });
    }

    const { proposedFee, message } = req.body;
    const { taskId } = req.params;

    if (!proposedFee || proposedFee <= 0) {
      return res.status(400).json({ error: 'Proposed fee must be positive' });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot apply offer on your own task' });
    }

    const existing = await Offer.findOne({ taskId, offeredBy: req.user._id });
    if (existing) {
      return res.status(400).json({ error: 'You have already applied an offer for this task' });
    }

    const worker = await require('../models/User').findById(req.user._id);
    const fee = task.participationFee;

    if (worker.walletBalance < fee) {
      return res.status(400).json({ error: 'Insufficient wallet balance to apply for this task' });
    }

    // Deduct fee
    worker.walletBalance -= fee;
    worker.transactions.push({
      type: 'debit',
      amount: fee,
      reason: `Participation fee for applying to task: ${task.title}`
    });
    await worker.save();

    const offer = new Offer({
      taskId,
      offeredBy: req.user._id,
      proposedFee,
      message
    });

    await offer.save();
    task.offers.push(offer._id);
    await task.save();

    res.status(201).json({ message: 'Offer applied successfully', offer });
  } catch (err) {
    console.error('Error in apply-offer:', err);
    res.status(500).json({ error: err.message });
  }
});


// Poster rejects an offer
router.post('/:offerId/reject', authMiddleware, async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findById(offerId).populate('offeredBy');
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    const task = await Task.findById(offer.taskId);
    if (!task || task.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to reject this offer' });
    }

    if (offer.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending offers can be rejected' });
    }

    // Refund participation fee
    const worker = offer.offeredBy;
    const fee = task.participationFee;

    worker.walletBalance += fee;
    worker.transactions.push({
      type: 'credit',
      amount: fee,
      reason: `Refund for rejected offer on task: ${task.title}`
    });
    await worker.save();

    // Update offer
    offer.status = 'rejected';
    await offer.save();

    // Remove offer from task
    if (task.offers.includes(offer._id)) {
      task.offers = task.offers.filter(oId => oId.toString() !== offer._id.toString());
      await task.save();
    }

    res.json({ message: 'Offer rejected and participation fee refunded', offer });
  } catch (err) {
    console.error('Error rejecting offer:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

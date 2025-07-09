const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const Offer = require('../models/Offer');
const Task = require('../models/Task');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// View a contract
router.get('/view/:contractId', authMiddleware, async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user._id;

    const contract = await Contract.findById(contractId)
      .populate({
        path: 'taskId',
        populate: { path: 'postedBy', select: 'name email' }
      })
      .populate({
        path: 'acceptedOffer',
        populate: { path: 'offeredBy', select: 'name email' }
      });

    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const isPoster = contract.taskId.postedBy._id.toString() === userId.toString();
    const isImplementer = contract.acceptedOffer.offeredBy._id.toString() === userId.toString();

    if (!isPoster && !isImplementer) {
      return res.status(403).json({ error: 'Not authorized to view this contract.' });
    }

    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-contracts', authMiddleware, async (req, res) => {
  try {
    const contracts = await Contract.find({ acceptedOffer: { $exists: true } })
      .populate({
        path: 'acceptedOffer',
        populate: {
          path: 'offeredBy',
          select: '_id name'
        }
      })
      .populate({
        path: 'taskId',
        select: 'title'
      });

    const myContracts = contracts
      .filter(c =>
        c.acceptedOffer &&
        c.acceptedOffer.offeredBy &&
        c.acceptedOffer.offeredBy._id.toString() === req.user._id.toString()
      )
      .map(c => ({
        _id: c._id,
        taskTitle: c.taskId.title,
        status: c.status,
        milestones: c.milestones
      }));

    res.json(myContracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-posted-contracts', authMiddleware, async (req, res) => {
  try {
    const contracts = await Contract.find({})
      .populate({
        path: 'taskId',
        select: 'title postedBy'
      })
      .populate({
        path: 'acceptedOffer',
        populate: {
          path: 'offeredBy',
          select: 'name'
        }
      });

    const myContracts = contracts
      .filter(c => c.taskId && c.taskId.postedBy && c.taskId.postedBy.toString() === req.user._id.toString())
      .map(c => ({
        _id: c._id,
        taskTitle: c.taskId.title,
        workerName: c.acceptedOffer?.offeredBy?.name || 'Unknown',
        status: c.status,
        milestones: c.milestones
      }));

    res.json(myContracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:contractId/milestones/:milestoneIndex/request-completion', authMiddleware, async (req, res) => {
  try {
    const { contractId, milestoneIndex } = req.params;
    const userId = req.user._id;

    const contract = await Contract.findById(contractId).populate('acceptedOffer');
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    if (contract.acceptedOffer.offeredBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to request milestone completion' });
    }

    if (milestoneIndex < 0 || milestoneIndex >= contract.milestones.length) {
      return res.status(400).json({ error: 'Invalid milestone index' });
    }

    const milestone = contract.milestones[milestoneIndex];

    if (milestone.completed) return res.status(400).json({ error: 'Milestone already completed' });
    if (milestone.completionRequested) return res.status(400).json({ error: 'Completion already requested' });

    milestone.completionRequested = true;
    await contract.save();

    res.json({ message: 'Milestone completion requested', contract });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:contractId/milestones/:milestoneIndex/approve', authMiddleware, async (req, res) => {
  try {
    const { contractId, milestoneIndex } = req.params;

    const contract = await Contract.findById(contractId).populate('taskId').populate('acceptedOffer');
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    if (contract.taskId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the poster can approve milestones.' });
    }

    const milestone = contract.milestones[milestoneIndex];
    if (!milestone || !milestone.completionRequested) {
      return res.status(400).json({ error: 'No valid completion request.' });
    }

    const totalFee = contract.acceptedOffer.proposedFee;
    let paymentAmount = totalFee;
    if (contract.paymentTerms === 'quarter') paymentAmount = totalFee / 4;
    else if (contract.paymentTerms === 'half') paymentAmount = totalFee / 2;

    const poster = await User.findById(contract.taskId.postedBy);
    const worker = await User.findById(contract.acceptedOffer.offeredBy);

    if (poster.walletBalance < paymentAmount) {
      return res.status(400).json({ error: 'Insufficient balance for payment.' });
    }

    poster.walletBalance -= paymentAmount;
    worker.walletBalance += paymentAmount;

    milestone.completed = true;
    milestone.completionRequested = false;

    await poster.save();
    await worker.save();
    await contract.save();

    res.json({ message: 'Milestone approved and paid.', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:contractId/milestones/:milestoneIndex/reject', authMiddleware, async (req, res) => {
  try {
    const { contractId, milestoneIndex } = req.params;
    const contract = await Contract.findById(contractId).populate('taskId');
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    if (contract.taskId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the poster can reject milestones.' });
    }

    const milestone = contract.milestones[milestoneIndex];
    if (!milestone || !milestone.completionRequested) {
      return res.status(400).json({ error: 'No valid completion request to reject.' });
    }

    milestone.completionRequested = false;
    await contract.save();

    res.json({ message: 'Milestone completion request rejected.', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-milestone-requests', authMiddleware, async (req, res) => {
  try {
    const workerId = req.user._id;

    const contracts = await Contract.find({})
      .populate({ path: 'taskId', select: 'title postedBy' })
      .populate({
        path: 'acceptedOffer',
        select: 'offeredBy proposedFee',
        populate: { path: 'offeredBy', select: '_id name email' }
      });

    const myRequests = [];

    contracts.forEach(contract => {
      if (contract.acceptedOffer.offeredBy._id.toString() !== workerId.toString()) return;

      contract.milestones.forEach((milestone, index) => {
        if (milestone.completionRequested || milestone.completed) {
          myRequests.push({
            taskTitle: contract.taskId.title,
            contractId: contract._id,
            milestoneIndex: index,
            stage: milestone.stage,
            description: milestone.description,
            status: milestone.completed ? 'Approved' : 'Pending Approval',
          });
        }
      });
    });

    res.json(myRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

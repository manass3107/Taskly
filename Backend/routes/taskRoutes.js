const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// Create a task — only poster allowed
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Authentication required. Please log in again.' });
    }

    if (req.user.role !== 'poster') {
      return res.status(403).json({ error: 'Only posters can create tasks.' });
    }

    const task = new Task({
      ...req.body,
      postedBy: req.user._id,
      createdBy: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Public: Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get all open tasks
router.get('/open', async (req, res) => {
  try {
    const tasks = await Task.find({ 
      status: 'open',
      deadline: { $gte: new Date() }
    })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Poster: Get their own tasks
router.get('/my-tasks', authMiddleware, async (req, res) => {
  try {
    const myTasks = await Task.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(myTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:taskId', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('postedBy', 'name email')
      .populate({
        path: 'offers',
        populate: { path: 'offeredBy', select: 'name email' }
      })
      .populate({
        path: 'contract',
        populate: [
          { path: 'acceptedOffer', populate: { path: 'offeredBy', select: 'name email' } }
        ]
      });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const Player = require('../models/Player');
const auth = require('../middleware/auth');
const { playerValidation, validate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/players
// @desc    Get all players
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { ageGroup, position, search, page = 1, limit = 50 } = req.query;
    
    let query = { isActive: true };
    
    // Add filters
    if (ageGroup) query.ageGroup = ageGroup;
    if (position) query.position = new RegExp(position, 'i');
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { position: new RegExp(search, 'i') },
        { ageGroup: new RegExp(search, 'i') }
      ];
    }

    const players = await Player.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Player.countDocuments(query);

    res.json({
      players,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching players',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/players/:id
// @desc    Get single player
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findOne({ _id: req.params.id, isActive: true });
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({ message: 'Server error while fetching player' });
  }
});

// @route   POST /api/players
// @desc    Create new player
// @access  Private (Admin only)
router.post('/', auth, playerValidation, validate, async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();

    res.status(201).json({
      message: 'Player created successfully',
      player
    });
  } catch (error) {
    console.error('Create player error:', error);
    res.status(500).json({ message: 'Server error while creating player' });
  }
});

// @route   PUT /api/players/:id
// @desc    Update player
// @access  Private (Admin only)
router.put('/:id', auth, playerValidation, validate, async (req, res) => {
  try {
    const player = await Player.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json({
      message: 'Player updated successfully',
      player
    });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({ message: 'Server error while updating player' });
  }
});

// @route   DELETE /api/players/:id
// @desc    Delete player (soft delete)
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const player = await Player.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({ message: 'Server error while deleting player' });
  }
});

// @route   GET /api/players/stats/summary
// @desc    Get player statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments({ isActive: true });
    
    const ageGroupStats = await Player.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$ageGroup', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const positionStats = await Player.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$position', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalPlayers,
      ageGroupStats,
      positionStats
    });
  } catch (error) {
    console.error('Get player stats error:', error);
    res.status(500).json({ message: 'Server error while fetching player statistics' });
  }
});

module.exports = router;
const express = require('express');
const Coach = require('../models/Coach');
const auth = require('../middleware/auth');
const { coachValidation, validate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/coaches
// @desc    Get all coaches
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    
    let query = { isActive: true };
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { role: new RegExp(search, 'i') }
      ];
    }

    const coaches = await Coach.find(query)
      .sort({ isHeadCoach: -1, experienceYears: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Coach.countDocuments(query);

    res.json({
      coaches,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get coaches error:', error);
    res.status(500).json({ message: 'Server error while fetching coaches' });
  }
});

// @route   GET /api/coaches/:id
// @desc    Get single coach
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const coach = await Coach.findOne({ _id: req.params.id, isActive: true });
    
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json(coach);
  } catch (error) {
    console.error('Get coach error:', error);
    res.status(500).json({ message: 'Server error while fetching coach' });
  }
});

// @route   POST /api/coaches
// @desc    Create new coach
// @access  Private (Admin only)
router.post('/', auth, coachValidation, validate, async (req, res) => {
  try {
    const coach = new Coach(req.body);
    await coach.save();

    res.status(201).json({
      message: 'Coach created successfully',
      coach
    });
  } catch (error) {
    console.error('Create coach error:', error);
    res.status(500).json({ message: 'Server error while creating coach' });
  }
});

// @route   PUT /api/coaches/:id
// @desc    Update coach
// @access  Private (Admin only)
router.put('/:id', auth, coachValidation, validate, async (req, res) => {
  try {
    const coach = await Coach.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json({
      message: 'Coach updated successfully',
      coach
    });
  } catch (error) {
    console.error('Update coach error:', error);
    res.status(500).json({ message: 'Server error while updating coach' });
  }
});

// @route   DELETE /api/coaches/:id
// @desc    Delete coach (soft delete)
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const coach = await Coach.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json({ message: 'Coach deleted successfully' });
  } catch (error) {
    console.error('Delete coach error:', error);
    res.status(500).json({ message: 'Server error while deleting coach' });
  }
});

// @route   GET /api/coaches/stats/summary
// @desc    Get coach statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const totalCoaches = await Coach.countDocuments({ isActive: true });
    const headCoaches = await Coach.countDocuments({ isActive: true, isHeadCoach: true });
    
    const experienceStats = await Coach.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgExperience: { $avg: '$experienceYears' },
          maxExperience: { $max: '$experienceYears' },
          minExperience: { $min: '$experienceYears' }
        }
      }
    ]);

    res.json({
      totalCoaches,
      headCoaches,
      assistantCoaches: totalCoaches - headCoaches,
      experienceStats: experienceStats[0] || {
        avgExperience: 0,
        maxExperience: 0,
        minExperience: 0
      }
    });
  } catch (error) {
    console.error('Get coach stats error:', error);
    res.status(500).json({ message: 'Server error while fetching coach statistics' });
  }
});

module.exports = router;
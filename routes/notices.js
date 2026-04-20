const express = require('express');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');
const { noticeValidation, validate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/notices
// @desc    Get all notices
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, pinned, page = 1, limit = 20 } = req.query;
    
    let query = { isActive: true };
    
    // Add filters
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') }
      ];
    }
    
    if (pinned !== undefined) {
      query.isPinned = pinned === 'true';
    }

    const notices = await Notice.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notice.countDocuments(query);

    res.json({
      notices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({ message: 'Server error while fetching notices' });
  }
});

// @route   GET /api/notices/:id
// @desc    Get single notice
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findOne({ _id: req.params.id, isActive: true });
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json(notice);
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({ message: 'Server error while fetching notice' });
  }
});

// @route   POST /api/notices
// @desc    Create new notice
// @access  Private (Admin only)
router.post('/', auth, noticeValidation, validate, async (req, res) => {
  try {
    const notice = new Notice({
      ...req.body,
      createdBy: req.admin.email
    });
    
    await notice.save();

    res.status(201).json({
      message: 'Notice created successfully',
      notice
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ message: 'Server error while creating notice' });
  }
});

// @route   PUT /api/notices/:id
// @desc    Update notice
// @access  Private (Admin only)
router.put('/:id', auth, noticeValidation, validate, async (req, res) => {
  try {
    const notice = await Notice.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({
      message: 'Notice updated successfully',
      notice
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ message: 'Server error while updating notice' });
  }
});

// @route   PATCH /api/notices/:id/pin
// @desc    Toggle notice pin status
// @access  Private (Admin only)
router.patch('/:id/pin', auth, async (req, res) => {
  try {
    const notice = await Notice.findOne({ _id: req.params.id, isActive: true });
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    notice.isPinned = !notice.isPinned;
    await notice.save();

    res.json({
      message: `Notice ${notice.isPinned ? 'pinned' : 'unpinned'} successfully`,
      notice
    });
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({ message: 'Server error while toggling pin status' });
  }
});

// @route   DELETE /api/notices/:id
// @desc    Delete notice (soft delete)
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ message: 'Server error while deleting notice' });
  }
});

// @route   GET /api/notices/stats/summary
// @desc    Get notice statistics
// @access  Private (Admin only)
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalNotices = await Notice.countDocuments({ isActive: true });
    const pinnedNotices = await Notice.countDocuments({ isActive: true, isPinned: true });
    
    const recentNotices = await Notice.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    res.json({
      totalNotices,
      pinnedNotices,
      recentNotices
    });
  } catch (error) {
    console.error('Get notice stats error:', error);
    res.status(500).json({ message: 'Server error while fetching notice statistics' });
  }
});

module.exports = router;
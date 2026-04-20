const express = require('express');
const Enquiry = require('../models/Enquiry');
const auth = require('../middleware/auth');
const { enquiryValidation, validate } = require('../middleware/validation');
const emailService = require('../services/emailService');

const router = express.Router();

// @route   GET /api/enquiries
// @desc    Get all enquiries (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    // Add filters
    if (status && ['new', 'read', 'resolved'].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Enquiry.countDocuments(query);

    res.json({
      enquiries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ message: 'Server error while fetching enquiries' });
  }
});

// @route   GET /api/enquiries/:id
// @desc    Get single enquiry (Admin only)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json(enquiry);
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({ message: 'Server error while fetching enquiry' });
  }
});

// @route   POST /api/enquiries
// @desc    Create new enquiry (Public - from contact form)
// @access  Public
router.post('/', enquiryValidation, validate, async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    // Send confirmation email to user (don't block the response)
    emailService.sendEnquiryConfirmation(enquiry)
      .catch(error => console.error('Failed to send confirmation email:', error));

    // Send notification email to admin (don't block the response)
    emailService.sendEnquiryNotificationToAdmin(enquiry)
      .catch(error => console.error('Failed to send admin notification:', error));

    res.status(201).json({
      message: 'Enquiry submitted successfully. We will contact you soon!',
      enquiry: {
        id: enquiry._id,
        name: enquiry.name,
        createdAt: enquiry.createdAt
      }
    });
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ message: 'Server error while submitting enquiry' });
  }
});

// @route   PATCH /api/enquiries/:id/status
// @desc    Update enquiry status (Admin only)
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: new, read, or resolved' });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json({
      message: `Enquiry marked as ${status}`,
      enquiry
    });
  } catch (error) {
    console.error('Update enquiry status error:', error);
    res.status(500).json({ message: 'Server error while updating enquiry status' });
  }
});

// @route   PATCH /api/enquiries/:id/notes
// @desc    Add/update notes for enquiry (Admin only)
// @access  Private
router.patch('/:id/notes', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!notes || notes.length > 500) {
      return res.status(400).json({ message: 'Notes are required and must not exceed 500 characters' });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json({
      message: 'Notes updated successfully',
      enquiry
    });
  } catch (error) {
    console.error('Update enquiry notes error:', error);
    res.status(500).json({ message: 'Server error while updating enquiry notes' });
  }
});

// @route   DELETE /api/enquiries/:id
// @desc    Delete enquiry (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({ message: 'Server error while deleting enquiry' });
  }
});

// @route   GET /api/enquiries/stats/summary
// @desc    Get enquiry statistics (Admin only)
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });
    const readEnquiries = await Enquiry.countDocuments({ status: 'read' });
    const resolvedEnquiries = await Enquiry.countDocuments({ status: 'resolved' });
    
    const recentEnquiries = await Enquiry.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    const monthlyStats = await Enquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalEnquiries,
      newEnquiries,
      readEnquiries,
      resolvedEnquiries,
      recentEnquiries,
      monthlyStats
    });
  } catch (error) {
    console.error('Get enquiry stats error:', error);
    res.status(500).json({ message: 'Server error while fetching enquiry statistics' });
  }
});

// @route   POST /api/enquiries/test-email
// @desc    Test email functionality (Admin only)
// @access  Private
router.post('/test-email', auth, async (req, res) => {
  try {
    const testEnquiry = {
      name: 'Test Parent',
      email: req.body.email || process.env.ADMIN_EMAIL,
      phone: '+91 9876543210',
      childAge: '12',
      message: 'This is a test enquiry to verify email functionality.'
    };

    await emailService.sendEnquiryConfirmation(testEnquiry);
    await emailService.sendEnquiryNotificationToAdmin(testEnquiry);

    res.json({ message: 'Test emails sent successfully!' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Failed to send test emails', error: error.message });
  }
});

module.exports = router;
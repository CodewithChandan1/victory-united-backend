const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Notice content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Index for better query performance
noticeSchema.index({ isPinned: -1, createdAt: -1 });
noticeSchema.index({ title: 'text', content: 'text' }); // Text search index

module.exports = mongoose.model('Notice', noticeSchema);
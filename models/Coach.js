const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Coach name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [100, 'Role cannot exceed 100 characters']
  },
  experienceYears: {
    type: Number,
    required: [true, 'Experience years is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  isHeadCoach: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
coachSchema.index({ isHeadCoach: -1, experienceYears: -1 });
coachSchema.index({ name: 'text', role: 'text' }); // Text search index

module.exports = mongoose.model('Coach', coachSchema);
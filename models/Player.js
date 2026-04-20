const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    trim: true,
    maxlength: [20, 'Age group cannot exceed 20 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [50, 'Position cannot exceed 50 characters']
  },
  
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
playerSchema.index({ ageGroup: 1, position: 1 });
playerSchema.index({ name: 'text' }); // Text search index

module.exports = mongoose.model('Player', playerSchema);
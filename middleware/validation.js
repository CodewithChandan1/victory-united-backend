const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Player validation rules
const playerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('ageGroup')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Age group is required and must not exceed 20 characters'),
  body('position')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Position is required and must not exceed 50 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL')
];

// Coach validation rules
const coachValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role is required and must not exceed 100 characters'),
  body('experienceYears')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience years must be between 0 and 50'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('isHeadCoach')
    .optional()
    .isBoolean()
    .withMessage('isHeadCoach must be a boolean')
];

// Notice validation rules
const noticeValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must not exceed 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content is required and must not exceed 2000 characters'),
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean')
];

// Enquiry validation rules
const enquiryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('childAge')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Child age is required'),
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters')
];

// Admin validation rules
const adminValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

module.exports = {
  validate,
  playerValidation,
  coachValidation,
  noticeValidation,
  enquiryValidation,
  adminValidation
};
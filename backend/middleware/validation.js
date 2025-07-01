const { body } = require('express-validator');

const validateBlogPost = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),
  body('youtubeUrl').optional().isURL().withMessage('YouTube URL must be valid'),
];

const validateLogin = [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
];

module.exports = {
  validateBlogPost,
  validateLogin,
};
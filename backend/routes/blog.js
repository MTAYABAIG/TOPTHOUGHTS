const express = require('express');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');
const { authenticateToken } = require('../middleware/auth');
const { validateBlogPost } = require('../middleware/validation');

const router = express.Router();

// GET /api/posts - Get all blog posts
router.get('/', getAllPosts);

// GET /api/posts/:id - Get single blog post
router.get('/:id', getPostById);

// POST /api/posts - Create new blog post (protected)
router.post('/', authenticateToken, validateBlogPost, createPost);

// PUT /api/posts/:id - Update blog post (protected)
router.put('/:id', authenticateToken, validateBlogPost, updatePost);

// DELETE /api/posts/:id - Delete blog post (protected)
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;
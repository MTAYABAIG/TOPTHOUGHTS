const express = require('express');
const authRoutes = require('./auth');
const blogRoutes = require('./blog');
const healthRoutes = require('./health');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/posts', blogRoutes);
router.use('/health', healthRoutes);

module.exports = router;
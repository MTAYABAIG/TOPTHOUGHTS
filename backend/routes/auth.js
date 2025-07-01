const express = require('express');
const { login } = require('../controllers/authController');
const { validateLogin } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateLogin, login);

module.exports = router;
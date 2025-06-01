const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Make sure you have this route:
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;

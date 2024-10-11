const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user');

// Requete POST signup
router.post('/signup', userControllers.signup);

// Requete POST login
router.post('/login', userControllers.login);

module.exports = router; 
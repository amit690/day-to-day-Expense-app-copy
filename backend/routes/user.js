const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.post('/signup', userController.createUser);

router.post('/login', userController.loginUser);

router.get('/status', authenticate, userController.status);

module.exports = router;

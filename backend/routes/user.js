const express = require('express');
const userController = require('../controlers/user');
const router = express.Router();

router.post('/signup', userController.createUser);

module.exports = router;

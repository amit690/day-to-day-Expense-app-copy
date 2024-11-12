const express = require('express');
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/add-expense', authenticate, expenseController.addExpense);
router.get('/get-expenses', authenticate, expenseController.getExpenses);

module.exports = router;

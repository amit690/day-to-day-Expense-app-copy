// routes/expenseRoutes.js
const express = require('express');
const expenseController = require('../controlers/expenseController');

const router = express.Router();

// Route to add an expense
router.post('/add-expense', expenseController.addExpense);

// Route to get all expenses
router.get('/get-expenses', expenseController.getExpenses);

module.exports = router;

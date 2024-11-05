// controllers/expenseController.js
const Expense = require('../models/expense');

// Controller to add a new expense
exports.addExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;

        // Validate input data
        if (!amount || !description || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new expense in the database
        const expense = await Expense.create({ amount, description, category });
        
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'An error occurred while adding the expense' });
    }
};

// Controller to get all expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'An error occurred while fetching expenses' });
    }
};

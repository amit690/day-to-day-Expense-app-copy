const Expense = require('../models/expense');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming User model is defined

// Helper to extract user ID from token
const getUserIdFromToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your actual secret key
    return decoded.userId;
};

// Controller to add a new expense
exports.addExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        const userId = getUserIdFromToken(req); // Get user ID from token

        if (!amount || !description || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new expense for the authenticated user
        const expense = await Expense.create({ amount, description, category, userId });
        
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'An error occurred while adding the expense' });
    }
};

// Controller to get all expenses for the authenticated user
exports.getExpenses = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req); // Get user ID from token

        // Fetch expenses associated with the userId
        const expenses = await Expense.findAll({ where: { userId } });

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'An error occurred while fetching expenses' });
    }
};

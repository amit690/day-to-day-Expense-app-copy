const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


// Controller function to handle user signup
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email is already in use
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user with the hashed password
        const user = await User.create({ name, email, password: hashedPassword });
        
        // Respond with a success message and the created user data (excluding the password for security)
        res.status(201).json({ message: "User created successfully", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "An error occurred while creating the user" });
    }
};

// Controller function to handle user login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};


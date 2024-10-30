const User = require('../models/user'); // Import the User mode
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

        // Create and save the new user
        const user = await User.create({ name, email, password });
        
        // Respond with a success message and the created user data (excluding the password for security)
        res.status(201).json({ message: "User created successfully", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "An error occurred while creating the user" });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // If both email and password are correct
        res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};

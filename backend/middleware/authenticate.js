const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Split to remove "Bearer " prefix if it exists
    if (!token) {
        return res.status(403).json({ error: 'Access denied, no token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key'); // Ensure 'your_secret_key' is correct
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;


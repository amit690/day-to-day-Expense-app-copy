const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database'); // Your Sequelize instance
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes);

// Sync Sequelize with the database and start the server
sequelize
    .sync() // Creates tables if they don’t exist
    .then(() => {
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database'); 
const expense = require('./models/expense');
const user = require('./models/user');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expenseRoutes');
const { FORCE } = require('sequelize/lib/index-hints');

expense.belongsTo(user);
user.hasMany(expense);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

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

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database'); 
const expense = require('./models/expense');
const user = require('./models/user');
const payment = require('./models/Payment');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expenseRoutes');
const { FORCE } = require('sequelize/lib/index-hints');
const purchaseRoutes = require('./routes/purchaseRoutes');



expense.belongsTo(user);
user.hasMany(expense);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);

// Sync Sequelize with the database and start the server
sequelize
    .sync() 
    .then(() => {
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/orders');

//Routers File Imports
const signupRoutes = require('./routes/signupR');
const loginRoutes = require('./routes/loginR');
const expenseRoutes = require('./routes/expenseR');
const purchaseRoutes = require('./routes/purchaseR');

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use(signupRoutes);
app.use(loginRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);

//tables relationship
User.hasMany(Expense);  // one to many
Expense.belongsTo(User) //one to one 

User.hasMany(Order);
Order.belongsTo(User);

//When force: true is set, it will drop the existing tables from the database and recreate them, effectively resetting the database schema.
sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
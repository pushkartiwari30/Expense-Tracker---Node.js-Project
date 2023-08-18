const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');


const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expenses');
const Income = require('./models/incomes');
const Order = require('./models/orders');
const Password = require('./models/password');
const FilesDownloaded = require('./models/filesdownloaded');

//Routers File Imports
const signupRoutes = require('./routes/signupR');
const loginRoutes = require('./routes/loginR');
const expenseRoutes = require('./routes/expenseR');
const incomeRoutes = require('./routes/incomeR');
const purchaseRoutes = require('./routes/purchaseR');
const premiumRoutes = require('./routes/premiumR');
const passwordRoutes = require('./routes/passwordR');
const downloadRoutes = require('./routes/downloadR');


app.use(cors());
app.use(bodyParser.json({ extended: false }));

// Set up static files serving for the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(signupRoutes);
app.use(loginRoutes);
app.use('/expense', expenseRoutes);
app.use('/income', incomeRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);
app.use('/user', downloadRoutes);

//tables relationship
User.hasMany(Expense);  // one to many
Expense.belongsTo(User) //one to one 

User.hasMany(Income);  // one to many
Income.belongsTo(User) //one to one 

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Password);
Password.belongsTo(User);

User.hasMany(FilesDownloaded);
FilesDownloaded.belongsTo(User);

//When force: true is set, it will drop the existing tables from the database and recreate them, effectively resetting the database schema.
sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
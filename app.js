const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expenses')


app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.post('/user/signup', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        //ecrypting algo
        const saltRounds = 10; // this decide the level of complexity of th hashcode to be generated. 
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            const data = await User.create({ name: name, email: email, password: hash })
            res.status(201).json({ data: data });
        })
    }
    catch (err) {
        //const error = err.parent.sqlMessage;
        res.status(403).json({
            error: err
        })
    }
});
// when email and password exixts and match 
app.post('/user/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            where: {
                email: email, // Specify the condition to match the email field
            }
        });
        if (user) {
            bcrypt.compare(password, user.dataValues.password, (err, result) => {
                if (result) {
                    console.log('Credentials are valid');
                    res.status(201).json({ message: 'Logged in Sucessfully' });
                }
                else {
                    console.log('Credentials are not valid');
                    res.status(401).json({ message: 'Password Does Not Match' });
                }
            })
        }
        else {
            console.log('User Not Found');
            res.status(404).json({ message: 'User Not Found' });
        }
    }
    catch (err) {
        //const error = err.parent.sqlMessage;
        res.status(404).json({
            error: err
        })
    }
});
app.post('/expense/addexpense', async (req, res) => {
    try {
        console.log(req.body);
        const amount = req.body.amount;
        const desc = req.body.desc;
        const cat = req.body.cat;
        const expense = await Expense.create({ amount: amount, description: desc, category: cat })
        res.status(201).json({ data: expense });

    }
    catch (err) {
        console.log(err);
    }
})
app.post('/expense/deleteexpense', async (req, res) => {
    try {
        console.log(req.body.id);
        await Expense.destroy({
            where: { id: req.body.id },
        });
        console.log("expense deleted");
        res.sendStatus(204);
    }
    catch (err) {
        console.log(err);
    }
})

app.get('/expense/getexpenses', async(req, res) => {
    try {
        const allExpense = await Expense.findAll();
        console.log(allExpense);
        res.status(200).json({allExpense : allExpense});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
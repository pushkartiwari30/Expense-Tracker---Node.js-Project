const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');


app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.post('/user/signup', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const data = await User.create({ name: name, email: email, password: password })
        res.status(201).json({ data: data });
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
            if (user.dataValues.password == password) {
                console.log('Credentials are valid');
                res.status(201).json({ message: 'Logged in Sucessfully' });
            }
            else {
                console.log('Credentials are not valid');
                res.status(400).json({ message: 'Password Does Not Match' });
            }
        }
        else {
            console.log('User Not Found');
            res.status(40).json({ message: 'User Not Found' });
        }
    }
    catch (err) {
        //const error = err.parent.sqlMessage;
        res.status(404).json({
            error: err
        })
    }
});




sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
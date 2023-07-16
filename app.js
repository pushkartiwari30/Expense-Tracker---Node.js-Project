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


sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
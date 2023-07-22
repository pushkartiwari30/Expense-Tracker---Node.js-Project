const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signUpUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        console.log(email);
        //ecrypting algo
        const saltRounds = 10; // this decide the level of complexity of th hashcode to be generated. 
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            const data = await User.create({ name: name, email: email, password: hash })
            console.log("sucess");
            res.status(201).json({ data: data });
        });
    }
    catch (err) {
        //const error = err.parent.sqlMessage;
        res.status(403).json({
            error: err
        })
    }
}
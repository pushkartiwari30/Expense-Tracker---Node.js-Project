const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signUpUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        console.log(email);
        //checking if email already exists in DB
        const userExists = await User.findOne({ where: { email: email } })
        console.log('USER EXISts ', userExists);
        if (userExists) {
            res.status(409).json({ error: { message: "User Already Exists" } });
        }
        else {
            //ecrypting algo
            const saltRounds = 10; // this decide the level of complexity of th hashcode to be generated. 
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                const data = await User.create({ name: name, email: email, password: hash, ispremiumuser: false })
                console.log("sucess");
                res.status(201).json({ data: data });
            });
        }
    }
    catch (err) {
        //const error = err.parent.sqlMessage;
        console.log("ERRRR");
        console.log("ERROR IS", err);
        res.status(403).json({
            error: err
        })
    }
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            where: {
                email: email, // Specify the condition to match the email field
            }
        });
        if (user) {
            function generateAccessToken (userId){
                return jwt.sign({userId: userId}, process.env.SECRET_KEY)
            };
            bcrypt.compare(password, user.dataValues.password, (err, result) => {
                if (result) {
                    console.log('Credentials are valid');
                    console.log(user.dataValues.id);
                    res.status(201).json({ message: 'Logged in Sucessfully' , user:user , token: generateAccessToken(user.dataValues.id)});
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
}
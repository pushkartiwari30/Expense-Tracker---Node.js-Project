const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
// this is a middleware that we have created to check who the user is . 
const authenticate = (req,res,next) =>{
    try{
        const token = req.header('Authorization');
        //console.log(token);
        console.log(process.env.SECRET_KEY);
        const user = jwt.verify(token, process.env.SECRET_KEY); //decrpting the secret key
        console.log('userId --> ',user.userId);
        User.findByPk(user.userId)
            .then(user=>{
                req.user = user; // we are attaching the user object to the request so that the next middle ware that  id the controller middle ware of expense will be able to know that whose expense to show in UI. 
                next();
            })
            .catch(err => {
                console.log(err);
            })
    }
    catch(err){
        console.log(err);
        res.status(401);
    }
}

module.exports = {
    authenticate
}
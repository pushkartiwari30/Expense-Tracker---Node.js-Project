const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bcrypt = require('bcrypt');

const Password = require('../models/password');
const User = require('../models/user');

exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body.email);
        console.log("controller file running");
        const defaultClient = Sib.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.SENDIB_API_KEY;
        const transactionalEmailsApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'ptiwari30013001@gmail.com'
        };//email of SIB account

        const to = [
            {
                email: req.body.email
            }
        ];
        const uuid = await uuidv4();
        const url = `http://localhost:3000/password/resetpassword/${uuid}`;
        const sendSmtpEmail = new Sib.SendSmtpEmail();
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = to;
        sendSmtpEmail.subject = 'Reset Password - Expense Tracker App';
        sendSmtpEmail.textContent = `It's Okay to forget things. Click on the URL to reset your password. ${url} `;

        transactionalEmailsApi.sendTransacEmail(sendSmtpEmail)
            .then(async response => {
                console.log('Email sent:', response);
                //Finding the userId of the user using email. 
                const user = await User.findOne({ where: { email: req.body.email } });
                // Creating an entry of password request in the Password Table of DB. 
                Password.create({
                    id: uuid,
                    userId: user.id,
                    isActive: true
                })
                res.status(200).json('OK');
            })
            .catch(error => {
                console.error('Error sending email:', error);
                res.status(500).json({ error: err });
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};
exports.resetPassword = async (req, res) => {
    console.log("This controller is working ");
    const uuid = req.params.uuid; //extracting uuid from url
    console.log(uuid);
    //If uuid it exists in Pasword table and "isActive" column is true return the user a form to update the new password.
    const passwordEntry = await Password.findOne({ where: { id: uuid } });
    if (passwordEntry) {
        if (passwordEntry.isActive === true) {
            passwordEntry.update({isActive: false}); //so that user should not be able to use the same reset password link again in the future
            const filePath = path.join(__dirname, '../views/resetPassword.html'); // Path to your HTML file
            res.sendFile(filePath); // Send the HTML file
        }
        else{
            res.send('This Link is Expired. Please Generate a New One');
        }
    }
    else {
        res.send("Invalid reset link or expired.");
    }
}

exports.updatePassword = async (req, res) => {
    const password = req.body.password;
    const uuid = req.body.uuid;
    const user = await Password.findOne({ where: { id: uuid } });

    try {
        if  (user) {
            console.log(user.dataValues.userId);
            const userId = user.dataValues.userId;
            //finding the user with user id
            const forgetfulUser = await User.findOne({ where: { id: userId } });
            console.log(forgetfulUser);
            // //ecrypting algo
            const saltRounds = 10; // this decide the level of complexity of th hashcode to be generated. 
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                forgetfulUser.update({ password: hash });
                console.log("sucess");
                res.status(201).json('OK');
            });
            
        }
        else {
            console.log("User Does Not Exists");
            res.status(404).json({ error: 'Not Found' });
        }

    }
    catch (err) {
        console.log(err);
        res.status(404).json({ error: err });
    }
}
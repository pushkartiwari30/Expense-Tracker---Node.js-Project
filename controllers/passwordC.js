const Sib = require('sib-api-v3-sdk');
exports.forgotPassword = (req, res) => {
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
        const sendSmtpEmail = new Sib.SendSmtpEmail();
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = to;
        sendSmtpEmail.subject = 'Reset Password - Expense Tracker App';
        sendSmtpEmail.textContent = "It's Okay to forget things. Click here to reset your password.";

        transactionalEmailsApi.sendTransacEmail(sendSmtpEmail)
            .then(response => {
                console.log('Email sent:', response);
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

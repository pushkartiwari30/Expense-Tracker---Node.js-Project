const express = require('express');
const router = express.Router();

const forgotPasswordContoller = require('../controllers/passwordC');

router.post('/forgotpassword', forgotPasswordContoller.forgotPassword);

module.exports = router;
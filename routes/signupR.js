const express = require('express');
const router = express.Router();

const signUpController = require('../controllers/signupC');

router.post('/user/signup', signUpController.signUpUser);

module.exports = router;
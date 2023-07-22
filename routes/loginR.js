const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginC')

router.post('/user/login', loginController.loginUser);

module.exports = router;
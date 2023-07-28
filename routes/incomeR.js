const express = require('express');
const router = express.Router();
require('dotenv').config();
const incomeController = require('../controllers/incomeC');
const userAuthenication = require('../middleware/authenticate');

router.post('/addincome', userAuthenication.authenticate, incomeController.addIncome); 
router.post('/deleteincome', incomeController.deleteIncome);
router.get('/getincomes', userAuthenication.authenticate, incomeController.getIncomes); // here we added the authentication middle ware. 

module.exports = router;           
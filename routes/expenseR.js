const express = require('express');
const router = express.Router();
require('dotenv').config();
const expenseController = require('../controllers/expenseC');
const userAuthenication = require('../middleware/authenticate');

router.post('/addexpense', userAuthenication.authenticate, expenseController.addExpense); 
router.post('/deleteexpense', userAuthenication.authenticate, expenseController.deleteExpense);
router.get('/getexpenses', userAuthenication.authenticate, expenseController.getExpenses); // here we added the authentication middle ware. 

module.exports = router;                                                                                                
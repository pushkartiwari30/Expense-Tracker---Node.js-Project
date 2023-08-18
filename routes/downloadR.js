const express = require('express');
const router = express.Router();
require('dotenv').config();

const downloadController = require('../controllers/downloadC');
const userAuthenication = require('../middleware/authenticate');

router.get('/download', userAuthenication.authenticate, downloadController.downloadFile);

module.exports = router;

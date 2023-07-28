const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premiumC');
const userAuthenication = require('../middleware/authenticate');

router.get('/showLeaderboard',premiumController.showLeaderboard);
module.exports = router;
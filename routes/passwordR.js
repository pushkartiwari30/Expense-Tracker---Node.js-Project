const express = require('express');
const router = express.Router();

const passwordContoller = require('../controllers/passwordC');

router.post('/forgotpassword', passwordContoller.forgotPassword);
router.get('/resetpassword/:uuid', passwordContoller.resetPassword);
router.post('/updatepassword', passwordContoller.updatePassword);


module.exports = router;
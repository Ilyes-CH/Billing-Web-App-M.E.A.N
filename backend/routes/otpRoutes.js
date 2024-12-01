const express = require('express');
const otpController = require('../helpers/otpController');
const router = express.Router();

router.post('/send-otp', otpController.sendOTP);


module.exports = router;
const express = require('express')
const otpHandler = require('../helpers/resetPasswordOtpController')
const OTP = require('../models/resetPasswordOtp')
const User = require('../models/user')
const isObjectId = require('../helpers/verifyObjectId')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: "../main/.env" })
const bcrypt = require('bcrypt')
const router = express.Router()
//route to send otp
router.post('/one-time-code', otpHandler.sendOTP)


router.get('/verify/:token', async (req, res) => {
    console.log(req.params.token)
    try {
        if (!isObjectId(req.params.token)) {
            return res.sendStatus(403)
        }
        const doc = await OTP.findById(req.params.token)
        console.log(doc)
        if (doc) {
            res.sendStatus(200)
        } else {
            res.sendStatus(403)
        }

    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

//route to verify and confirm otp and reset the password
router.post('/reset-password/:otp', async (req, res) => {

    console.log(req.params.otp)
    const userObject = req.body
    console.log(userObject)
    //find the most recent OTP for the email
    const response = await OTP.find({ otp: req.params.otp }).sort({ createdAt: -1 }).limit(1)
    console.log(response)
    if (response.length === 0 || req.params.otp !== response[0].otp) {
        res.status(400).json({
            message: 'The OTP is not valid',
        });
    } else {
        //reset the password
        const hashedPassword = await bcrypt.hash(userObject.password, 10);
        const user = await User.updateOne({ email: response[response.length - 1].email }, { password: hashedPassword })

        if (user.nModified == 1) {
            console.log(user)
            const deletedOTP = await OTP.deleteOne({_id: response[response.length -1]._id})
            res.status(200).json({ message: "done" })
        } else {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
})



module.exports = router;
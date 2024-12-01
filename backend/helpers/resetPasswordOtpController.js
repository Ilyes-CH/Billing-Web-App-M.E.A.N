/**
 * @Actions POST
 * @Auto send unique otp and verifies uniquness and reset password
 */


const otpGenerator = require('otp-generator');
const OTP = require('../models/resetPasswordOtp');
const User = require('../models/user');


exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user is already present
        const checkUserPresent = await User.findOne({ email });
        // If user found with provided email
        if (!checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'Email is Incorrect',
            });
        }
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        //verify uniquness otherwise create a new otp code
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            token: otpBody._id
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

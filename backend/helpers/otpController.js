/**
 * @Actions POST
 * @Auto send unique otp and verifies uniquness
 */


const otpGenerator = require('otp-generator');
const OTP = require('../models/otpModel');
const User = require('../models/user');
const { v3: uuidv3 } = require('uuid');


exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const { role } = req.body;
        
        if(role == "" || !role) return res.status(400).json({message:'Bad Request'})
            
        const isThereAnAdmin = await User.findOne({role: role})
        if(isThereAnAdmin && role == "Admin") return res.status(400).json({message:'Bad Request'})
        
            // Check if user is already present
        const checkUserPresent = await User.findOne({ email });
        // If user found with provided email
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User is already registered',
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
        const otpPayload = { email, otp, ...(role === "Accountant" && { workId: uuidv3(email, uuidv3.DNS) }) };
        const otpBody = await OTP.create(otpPayload);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
           
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

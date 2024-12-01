const mongoose = require('mongoose');

const { sendEmailWithoutAttachment } = require('../helpers/mailer')

const otpSchema = mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    workId: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
    },
});

//hook to send verification email at every OTP document creation
otpSchema.pre("save", async function (next) {
    console.log("New OTP Document saved to db")
    // Only send an email when a new document is created
    if (this.isNew) {
        await sendEmailWithoutAttachment("", this.email, 'Account Verrification', "confirmAccount", {otp:this.otp,workId:this.workId});
    }
    next()
})
module.exports = mongoose.model("OTP", otpSchema);
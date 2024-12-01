const mongoose = require('mongoose')


const userArchiveSchema = mongoose.Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, },
    workId: { type: String },
    avatar: { type: String },
    role: { type: String, required: true, enum: ["Admin", "Learner", "Accountant"] },
    updated: { type: Date, default: Date.now, },
    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    creationDate:{type:Date},

})


const userArchive = mongoose.model('userArchive', userArchiveSchema);

module.exports = userArchive;

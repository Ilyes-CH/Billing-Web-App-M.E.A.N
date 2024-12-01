const mongoose = require('mongoose')



const feedbackSchema = mongoose.Schema({
    commentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true }, // positive or negative
    subject: { type: String, required: true },
    comments: { type: String, required: true },
    date: { type: Date, default: Date.now() }
})


const feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = feedback;

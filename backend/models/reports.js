const mongoose = require('mongoose')



const reportSchema = mongoose.Schema({
    accountantId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    title: {type:String,required:true}, // positive or negative
    subject: {type: String},
    content : {type:String,required: true},
    date: { type: Date, default: Date.now() }
})


const report = mongoose.model('Report', reportSchema);

module.exports = report;

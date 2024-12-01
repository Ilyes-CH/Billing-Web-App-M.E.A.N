const mongoose = require('mongoose')


const noticeSchema = mongoose.Schema({
  serviceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  details: { type: String }, //addtional information
  customerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  subtotal: Number,
  taxRate: Number,
  total: Number,
  taxAmount: Number,
  taxPerService: Number,
  quantity: [Number],
  path: { type: String },
  generationDate: { type: Date, default: Date.now() }

})


const notice = mongoose.model('Notice', noticeSchema);

module.exports = notice;

const mongoose = require('mongoose')


const invoiceSchema = mongoose.Schema({
  serviceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  details: { type: String },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  archivedUserId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'userArchive'
  },
  path: { type: String },
  generationDate: { type: Date, default: Date.now() }
})


const invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = invoice;

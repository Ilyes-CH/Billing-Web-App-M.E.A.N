const mongoose = require('mongoose')


const orderSchema = mongoose.Schema({
  serviceIds: [

    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ]
  ,
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice"
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  archivedUserId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'userArchive'
  },
  total: { type: Number },
  purchaseDate: { type: Date, default: Date.now() }
})


const order = mongoose.model('Order', orderSchema);

module.exports = order;



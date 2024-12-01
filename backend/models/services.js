const mongoose = require('mongoose')

const detailsSchema = mongoose.Schema({
  duration: String,
  parts: Number,
  courses:[{
    courseName: String,
    modules: [String]
  }]
  
})


const serviceSchema = mongoose.Schema({
  image : {type:String},
  name: { type: String, required: true },
  priceHT: { type: Number, required: true },
  details: detailsSchema,
  createdAt:{type: Date, default:Date.now()}

})


const service = mongoose.model('Service',serviceSchema);

module.exports = service;

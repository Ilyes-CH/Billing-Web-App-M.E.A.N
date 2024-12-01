const mongoose = require('mongoose');
const validators = require('../helpers/userValidators');

const userSchema = mongoose.Schema({

  firstName: { type: String, required: true, validate: validators.firstNameValidation, trim: true },
  lastName: { type: String, required: true, validate: validators.lastNameValidation, trim: true },
  phone: { type: String, required: true, validate: validators.phoneValidator },
  email: { type: String, required: true, validate: validators.emailValidator, trim: true },
  city: { type: String, },
  country: { type: String,},
  zip: { type: Number, },
  workId: { type: String },
  avatar: { type: String },
  role: { type: String, required: true, enum: ["Admin", "Learner", "Accountant"] },
  status: { type: Boolean },
  password:{type:String, required: true},
  updated: { type: Date, default: Date.now, },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  refreshToken: String,

})

const user = mongoose.model("User", userSchema)

module.exports = user;
 
const validate = require('mongoose-validator');

// First name validation
const firstNameValidation = [
  validate({
    validator: "isLength",
    arguments: [3, 10],
    message: 'First name must be at least 3 characters and at most 6 characters'
  }),
  validate({
    validator: "isAlpha",
    passIfEmpty: true,
    message: "First name should contain alphabetic characters only"
  })
];

// Last name validation
const lastNameValidation = [
  validate({
    validator: "isLength",
    arguments: [3, 10],
    message: 'Last name must be at least 3 characters and at most 6 characters'
  }),
  validate({
    validator: "isAlpha",
    passIfEmpty: true,
    message: "Last name should contain alphabetic characters only"
  })
];

// Email validation
const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Must be a valid email address',
  }),
];

// Phone validation
const phoneValidator = [
  validate({
    validator: "isLength",
    arguments: [8, 10],
    message: 'Phone number must be between 8 and 10 characters'
  }),
  validate({
    validator: 'matches',
    arguments: [/^\+?[1-9]\d{1,14}$/],  // E.164 format for international phone numbers
    message: 'Must be a valid phone number with country code',
  }),
];

// Age validation
const ageValidator = [
  validate({
    validator: 'isInt',
    arguments: [{ min: 18, max: 100 }],
    message: 'Age should be between 18 and 100 years',
  }),
];

// Exporting the validators using CommonJS
module.exports = {
  firstNameValidation,
  lastNameValidation,
  emailValidator,
  phoneValidator,
  ageValidator,
};

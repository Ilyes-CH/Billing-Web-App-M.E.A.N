const mongoose = require('mongoose');

/**@TODO Add logic to dynamically check if user is archived or active */

const predictionchema = new mongoose.Schema({
    predictions: Array,
    date: {
        type: Date,
        default: Date.now(),
    },
});

const Predictions = mongoose.model('Prediction', predictionchema);

module.exports = Predictions;

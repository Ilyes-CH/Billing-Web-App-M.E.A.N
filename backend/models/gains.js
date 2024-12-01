const mongoose = require('mongoose');

/**@TODO Add logic to dynamically check if user is archived or active */

const gainsSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    archivedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserArchive',
    },
    ordersId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    total: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Gains = mongoose.model('Gain', gainsSchema);

module.exports = Gains;
 
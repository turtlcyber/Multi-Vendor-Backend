const mongoose = require('mongoose');


const deletedCustomersSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    deletedCustomerData: {
        type: String,
    },

    reason: {
        type: String,
    },

    feedback: {
        type: String,
    },

    deletedAt: {
        type: String,
    }
}, {timestamps: true});


module.exports = mongoose.model("Deletedcustomer", deletedCustomersSchema);
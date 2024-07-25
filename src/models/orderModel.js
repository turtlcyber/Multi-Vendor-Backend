const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const orderSchema = new mongoose.Schema({
    
    customer_name: {
        type: String,
        default: ""
    },

    customer_mobile: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["PENDING", "PREPARING", "CANCELED", "APPROVED", "COMPLETED", "UNDEFINED"],
        default: "UNDEFINED"
    },

    notes: {
        type: String,
        default: ""
    },

    item_list: [
        {
            restaurant_id: { type: String, default: "" },
            item_name: { type: String, default: "" },
            qty: { type: Number, default: 1 },
            selling_price: { type: Number, default: 0 },
            isTaxable: { type: Boolean },
            imgUrl: { type: String, default: "" },
            isVeg: { type: Boolean }
        }
    ],

    total_items: {
        type: Number,
    },

    tax: {
        type: Number
    },

    total: {
        type: Number
    },

    grand_total: {
        type: Number
    },

    question: {
        type: String,
    },

    feedback: {
        type: String,
    }
    
}, {timestamps: true});


module.exports = mongoose.model("Order", orderSchema);
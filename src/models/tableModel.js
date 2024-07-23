const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const tableSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    tableId: {
        type: String,
        required: true,
        unique: true,
    },

    table_name: {
        type: String,
        required: true,
        unique: true,
    },

    table_type: {
        type: String,
    },

    head_count: {
        type: Number,
    },

    isIndoor: {
        type: Boolean
    }
    
}, { timestamps: true });

module.exports = mongoose.model("Table", tableSchema);
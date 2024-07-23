const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },

    description: {
        type: String,
    },

    category_image: {
        fileName: {
            type: String,
            default: ""
        },

        filePath: {
            type: String,
            default: ""
        }
    },

    cat_enum: {
        type: String,
        enum: ["", ""]
    },
}, {timestamps: true});

module.exports = mongoose.model("Category", categorySchema);
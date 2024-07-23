const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const restaurantSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true,
    },

    userName: {
        type: String,
    },

    email: {
        type: String,
    },

    mobile: {
        type: String,
    },

    profilePic: {
        type: String,
    },

    restaurantName: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    restaurant_address: {
        address: {
            type: String,
            default: ""
        },

        apartment: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        post_code: {
            type: String,
            default: ""
        },

        state: {
            type: String,
            default: ""
        }
    },

    location: {
        latitude: {
            type: Number,
            default: 0.0
        },

        longitude: {
            type: Number,
            default: 0.0
        }
    },

    logo: {
        fileName: { type: String, default: "" },
        filePath: { type: String, default: "" }
    },

    slug: {
        type: String,
        default: ""
    },

    categoryId: {
        type: ObjectId,
        ref: 'Category'
    },

    categoryName: {
        type: String,
        default: ""
    },

    sitting_capacity: {
        type: Number,
        default: 0
    },

    isVeg: {
        type: Boolean,
        default: true
    },

    max_allow_seating: {
        type: Number,
        default: 0
    },

    banners: [
        {
            fileName: { type: String, default: "" },
            filePath: { type: String, default: "" }
        }
    ],

    contact_number: {
        type: String,
        default: ""
    },

    contact_person: {
        type: String,
        default: ""
    },

    website: {
        type: String,
        default: ""
    },

    rating_review_url: {
        type: String,
        default: ""
    },

    GST_number: {
        type: String,
        default: ""
    },

    tax: {
        type: String,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
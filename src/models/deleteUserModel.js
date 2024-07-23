const mongoose = require('mongoose');


const deletedRestaurantsSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    deletedRestaurantData: {
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


module.exports = mongoose.model("DeletedRestaurant", deletedRestaurantsSchema);
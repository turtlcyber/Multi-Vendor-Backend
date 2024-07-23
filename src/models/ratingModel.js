const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ratingSchema = new mongoose.Schema(
  {
    productId: {
      type: ObjectId,
      ref: "Product",
    },

    ratings: [{
        customerId: {
            type: String,
        },

        name: {
          type: String,
        },

        rating: {
            type: Number,
        },

        comment: {
            type: String,
        },

        time: {
          type: String,
        }
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);

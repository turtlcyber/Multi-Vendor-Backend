const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const itemSchema = new mongoose.Schema({

    userId: {
        type: String,
        default: ""
    },

    menuId: {
        type: String,
        default: ""
    },

    item_name: {
        type: String,
        default: "",
    },

    menuName: {
        type: String,
        default: "",
    },

    categoryId: {
        type: ObjectId,
        ref: "Category"
    },

    categoryName: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: "",
    },

    selling_price: {
        type: Number,
        default: 0
    },

    isTaxable: {
        type: Boolean
    },

    preparing_time: {
        type: String,
        default: ""
    },

    notes: {
        type: String,
        default: ""
    },

    item_images: [
        { 
            fileName: { type: String, default: "" },
            filePath: { type: String, default: "" }
        }
    ],

    ratings: [
        {
          customerId: {
            type: ObjectId,
            ref: "Customer",
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
            type: String
          }
        },
      ],
  
      averageRating: {
        type: Number,
      },
  
      totalRatingCount: {
        type: Number,
      },
  
      ratingPercentages: {
  
      },

    visit_count: {
        type: Number,
        default: 0
    },

    status: {
        type: Boolean,
    },

    seo_keywords: [],

    video_link: {
        type: String,
        default: ""
    },

    isVeg: {
        type: Boolean
    },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);
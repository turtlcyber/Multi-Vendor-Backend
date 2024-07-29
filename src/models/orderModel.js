const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({

  orderID: {
    type: Number
  },

  customerId: {
    type: String,
  },
  
  CGST:{
    type: Number,
  },
  SGST:{
    type: Number,
  },
  totalProduct: {
    type: Number
  },
  paymentType: {
    type: String,
  },
  tax: {
    type: Number,
  },
  total: {
    type: Number,
  },
  grandTotal: {
    type: Number,
  },
  address: {
    type: String,
  },
  apartment: {
    type: String,
  },
  city: {
    type: String,
  },
  countryCode: {
    type: String
  },
  countryName: {
    type: String
  },
  post_code:{
    type: String,
  },
  state_code: {
    type: String,
  },
  state: {
    type: String,
  },
  email: {
    type: String,
  },
  f_name: {
    type: String,
  },
  l_name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Shipped", "Completed", "Cancel"],
    default: "Pending"
  },

  question: {
    type: String,
  },

  feedback: {
    type: String,
  },
  
  productList: [
    {
      productId: {
        type: String,
      },
      restaurant_id: {
        type: String,
      },
      MrpTotal: {
        type: Number,
      },
      SubTotal: {
        type: Number
      },
      averageRating: {
        type: Number
      },
      preparing_time: {
        type: String,
      },
      cartQty: {
        type: Number
      },
      description: {
        type: String,
      },
      isVeg: {
        type: Boolean,
      },
      mrp: {
        type: Number
      },
      name: {
        type: String
      },
      salePrice: {
        type: Number
      },
      qty: {
        type: Number
      },
      skuCode: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
      totalRatingCount: {
        type: Number
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
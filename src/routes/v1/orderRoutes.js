const express = require('express');
const router = express.Router();

const { createOrder, getAllOrders, getOrderById, updateOrderById, cancelOrderById, updateOrderStatus } = require('../../controllers/orderController');

// CREATE ORDER
router.post("/api/v1/createOrder/:customerId", createOrder);

// GET ALL ORDERS
router.get("/api/v1/getAllOrders/:restaurantId", getAllOrders);

// GET ORDER BY ORDER ID
router.get("/api/v1/getOder/:orderId", getOrderById);

// UPDATE ORDER BY ORDER ID
router.put("/api/v1/updateOrder/:orderId", updateOrderById);

// Cancel Order By Id
router.put("/api/v1/cancelorder/:orderId", cancelOrderById);

// Update Order Status
router.put("/api/v1/updateOrderStatus/:orderId", updateOrderStatus);


module.exports = router;
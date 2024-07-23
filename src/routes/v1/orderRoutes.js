const express = require('express');
const router = express.Router();

const { createOrder, getAllOrders, getOrderById, updateOrderById } = require('../../controllers/orderController');

// CREATE ORDER
router.post("/api/v1/createOrder/:restaurant_id", createOrder);

// GET ALL ORDERS
router.get("/api/v1/getAllOrders", getAllOrders);

// GET ORDER BY ORDER ID
router.get("/api/v1/getOder/:orderId", getOrderById);

// UPDATE ORDER BY ORDER ID
router.put("/api/v1/updateOrder/:orderId", updateOrderById);


module.exports = router;
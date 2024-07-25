const { isValidObjectId } = require("mongoose");
const orderModel = require("../models/orderModel");
const restaurantModel = require("../models/restaurantModel");

const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
let { getCurrentIPAddress } = require('../utils/utils');
const { port } = require("../config/config");

// CREATE ORDER
const createOrder = async (req, res) => {
    try {
        const { restaurant_id } = req.params;

        if (!restaurant_id) {
            return res.status(400).send({ status: false, message: "Restaurant Id is required" });
        };

        if (!isValidObjectId(restaurant_id)) {
            return res.status(400).send({ status: false, message: "Invalid Restaurant Id" });
        };

        let restaurant = await restaurantModel.findOne({ userId: restaurant_id });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Restaurant not found" });
        };

        let { table_name, customer_name, customer_mobile, head_count, status, notes, item_list, total_items, tax, total, grand_total, question, feedback } = req.body;

        let items = [];

        for (let itemData of item_list) {
            let { item_name, qty, imgUrl, selling_price, isVeg, isTaxable } = itemData;

            items.push({
                restaurant_id,
                item_name,
                qty,
                imgUrl,
                selling_price,
                isVeg,
                isTaxable,
            });
        };

        let orderData = {
            table_name,
            customer_name,
            customer_mobile,
            head_count,
            status,
            notes,
            item_list,
            total_items,
            tax,
            total,
            grand_total,
            question,
            feedback,
        };

        let newOrder = await orderModel.create(orderData);

        return res.status(200).send({
            status: true,
            message: "Order created successfully",
            data: newOrder,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


// GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        let orders = await orderModel.find();

        return res.status(200).send({
            status: true,
            message: "Success",
            data: orders,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


// GET ORDER BY ORDER ID
const getOrderById = async (req, res) => {
    try {
        let { orderId } = req.params;

        if (!orderId) {
            return res.status(400).send({ status: false, message: "Order Id is required" });
        };

        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "Invalid Order Id" });
        };

        let order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(400).send({ status: false, message: "Order not found"});
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            data: order,
        });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message }); 
    }
};


// UPDATE ORDER
const updateOrderById = async (req, res) => {
    try {
        const { orderId, restaurant_id, customer_name } = req.params;
        if (!orderId) {
            return res.status(400).send({ status: false, message: "OrderId is required"});
        };

        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "Invalid OrderId"});
        };

        let order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(400).send({ status: false, message: "Order not found"});
        };

        let restaurant;
        if (restaurant_id) {
            restaurant = await restaurantModel.findOne({ userId: restaurant_id });

            if (!restaurant) {
                return res.status(400).send({ status: false, message: "Restaurant Not Found" });
            };
        };

        let flag = restaurant ? restaurant : customer_name;

        let e = req.body;

        if ("table_name" in e) {
            order.table_name = e.table_name;
        };

        if ("customer_name" in e) {
            order.customer_name = e.customer_name;
        };

        if ("customer_mobile" in e) {
            order.customer_mobile = e.customer_mobile;
        };

        if ("head_count" in e) {
            order.head_count = e.head_count;
        };

        if ("status" in e) {
            order.status = e.status;
        };

        if ("notes" in e) {
            order.notes = e.notes;
        };

        if ("item_list" in e) {
            if (order.item_list.length) {
                for (let item of order.item_list) {
                    if ("item_name" in e.item_list) {
                        item.item_name = e.item_list.item_name;
                    };

                    if ("qty" in e.item_list) {
                        item.qty = e.item_list.qty;
                    };

                    if ("selling_price" in e.item_list) {
                        item.selling_price = e.item_list.selling_price;
                    };

                    if ("isTaxable" in e.item_list) {
                        item.isTaxable = e.item_list.isTaxable;
                    };

                    if ("isVeg" in e.item_list) {
                        item.isVeg = e.item_list.isVeg;
                    };
                }
            }  
        };

        if ("total_items" in e) {
            order.total_items = e.total_items;
        };

        if ("tax" in e) {
            order.tax = e.tax;
        };

        if ("question" in e) {
            order.question = e.question;
        };

        if ("feedback" in e) {
            order.feedback = e.feedback;
        };

        await order.save();

        return res.status(200).send({
            status: true,
            message: "Order updated successfully",
            data: order,
            canceledBy: flag,
        });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


// DELETE ORDER BY ID
const deleteOrderById = async (req, res) => {
    try {
        let { orderId } = req.params;
        if (!orderId) {
            return res.status(400).send({ status: false, message: "OrderId is required"});
        };

        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "Invalid OrderId"});
        };

        let order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(400).send({ status: false, message: "Order not found"});
        };

        await orderModel.deleteOne({ _id: orderId });

        return res.status(200).send({
            status: true,
            message: "Order deleted successfully",
        })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
};


// CANCEL ORDER
const cancelOrder = async (req, res) => {
    try {
        let { orderId } = req.params;
        if (orderId) {
            return res.status(400).send({ status: false, message: "OrderId is required"});
        };

        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "Invalid orderId" });
        };

        let order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(400).send({ status: false, message: "Order Not found"});
        };

        if (order.status === "CANCELED") {
            return res.status(400).send({ status: false, message: "This order is already canceled"});
        };

        let { status, restaurant_id, customer_mobile, customer_name } = req.body;

        let restaurant = null;
        if (restaurant_id) {
            restaurant = await restaurantModel.findOne({ userId: restaurant_id });
        };

        let flag = restaurant ? restaurant.restaurantName : customer_name;

        order.status = status;

        await order.save();

        return res.status(200).send({
            status: true,
            message: "Order Canceled Successfully",
            data: order,
            canceledBy: flag,
        });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


// UPDATE ORDER BY RESTAURANT
const updateOrderByRestaurant = async (req, res) => {
    try {
        let { orderId } = req.params;

        if (!orderId) {
            return res.status(400).send({ status: false, message: "Order Id is required"});
        };

        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "Invalid orderId"});
        };

        let order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(400).send({ status: false, message: "Order not found"});
        };

        let { status } = req.body;

        if (order.status === "CANCELED") {
            return res.status(400).send({ status: false, message: "This order is already canceled"});
        }

        order.status = status

        await order.save();

        return res.status(200).send({
            status: true,
            message: "Order updated successfully",
            order: order,
        });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
};


// UPLOAD ITEMS IMAGES
const uploadItemImages = async (req, res) => {
    try {
        let { itemId } = req.params;

        if (!itemId) {
            return res.status(400).send({ status: false, message: "Item Id is required"});
        };

        let item = await itemModel.findById(itemId);

        if (!item) {
            return res.status(400).send({ status: false, message: "Item not found"});
        };

        let itemImages = Array.isArray(req.files.itemImages) ? req.files.itemImages : [req.files.itemImages];

        if (!itemImages.length === 0) {
            return res.status(400).send({ status: false, message: "No item image uploaded"});
        };

        let itemImgArr = [];

        for (let img of itemImages) {
            let imgRelativePath = "/items/";
            let currentIpAddress = getCurrentIPAddress();
            let imgUniqName = uuid.v4() + "." + img.name.split(".").pop();
            let imgUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "items", imgUniqName);

            img.mv(imgSavingPath, (err) => {
                if (err) throw err;
            });

            let imgObj = {
                imgName: imgUniqName,
                imgUrl: imgUrl
            };

            itemImgArr.push(imgObj);
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            data: item,
        });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    };
};


module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById,
    cancelOrder,
    updateOrderByRestaurant,
    uploadItemImages
};

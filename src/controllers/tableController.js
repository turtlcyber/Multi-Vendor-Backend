const tableModel = require('../models/tableModel');
const restaurantModel = require('../models/restaurantModel');
const { isValidObjectId } = require('mongoose');
const logger = require('../config/loggerConfig1');


// ADD TABLE
const addTable = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "User Id is required"});
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Restaurant Not Found"});
        };

        let { table_name, table_type, head_count, isIndoor } = req.body;

        if (!table_name || !table_type || !head_count || typeof isIndoor === 'undefined') {
            return res.status(400).send({ status: false, message: "All fields are required"});
        };

        let tableId;
        let isTableAlreadyExist;

        do {
            tableId = Math.floor(100000 + Math.random() * 899999);
            isTableAlreadyExist = await tableModel.findOne({ tableId });
        } while (isTableAlreadyExist);

        let tableData = {
            userId,
            tableId,
            table_name,
            table_type,
            head_count,
            isIndoor
        };

        let newTable = await tableModel.create(tableData);

        return res.status(200).send({
            status: true,
            message: "Table added successfully",
            data: newTable
        });

    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };
        logger.error(`Error in addTable API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    };
};


// GET ALL TABLES
const getAllTables = async (req, res) => {
    try {

        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "User Id is required"});
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Restaurant Not Found"});
        };

        let tables = await tableModel.find({ userId });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: tables
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };
        logger.error(`Error in getAllTables API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    };
};


// GET TABLE BY TABLE ID
const getTableById = async (req, res) => {
    try {
        let { tableId } = req.params;
        if (!tableId) {
            return res.status(400).send({ status: false, message: "Table Id is required" });
        };

        if (!isValidObjectId(tableId)) {
            return res.status(400).send({ status: false, message: "Invalid TableId"});
        };

        let table = await tableModel.findById(tableId);

        if (!table) {
            return res.status(400).send({ status: false, message: "Table Not Found"});
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            data: table,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };
        logger.error(`Error in getTableById API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    };
};


// UPDATE TABLE BY TABLE ID
const updateTableById = async (req, res) => {
    try {
        let { tableId } = req.params;
        if (!tableId) {
            return res.status(400).send({ status: false, message: "Table Id is required"});
        };

        if (!isValidObjectId(tableId)) {
            return res.status(400).send({ status: false, message: "Invalid TableId"});
        };

        let table = await tableModel.findById(tableId);

        if (!table) {
            return res.status(400).send(400).send({ status: false, message: "Table Not Found"});
        };

        let e = req.body;

        if ("table_name" in e) {
            table.table_name = e.table_name;
        };

        if ("table_type" in e) {
            table.table_type = e.table_type;
        };

        if ("head_count" in e) {
            table.head_count = e.head_count;
        };

        if ("isIndoor" in e) {
            table.isIndoor = e.isIndoor;
        }

        await table.save();

        return res.status(200).send({
            status: true,
            message: "Table updated successfully",
            data: table
        })
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };
        logger.error(`Error in updateTableById API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    };
};


// DELETE TABLE BY TABLE ID
const deleteTableById = async (req, res) => {
    try {
        let { tableId } = req.params;
        if (!tableId) {
            return res.status(400).send({ status: false, message: "Table Id is required"});
        };

        if (!isValidObjectId(tableId)) {
            return res.status(400).send({ status: false, message: "Invalid TableId"});
        };

        let table = await tableModel.findById(tableId);

        if (!table) {
            return res.status(400).send(400).send({ status: false, message: "Table Not Found"});
        };

        await tableModel.deleteOne({ _id: tableId });

        return res.status(200).send({
            status: true,
            message: "Table deleted successfully",
        })
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };
        logger.error(`Error in deleteTableById API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    };
};


module.exports = {
    addTable,
    getAllTables,
    getTableById,
    updateTableById,
    deleteTableById
};
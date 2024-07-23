const express = require('express');
const router = express.Router();

const { 
    addTable, 
    getAllTables, 
    getTableById, 
    updateTableById, 
    deleteTableById 
} = require('../../controllers/tableController');

// ADD TABLE
router.post("/api/v1/addTable/:userId", addTable);

// GET ALL TABLES
router.get("/api/v1/getAllTables/:userId", getAllTables);

// GET TABLE BY ID
router.get("/api/v1/getTable/:tableId", getTableById);

// UPDATE TABLE BY ID
router.put("/api/v1/updateTable/:tableId", updateTableById);

// DELETE TABLE BY ID
router.delete("/api/v1/deleteTable/:tableId", deleteTableById);

module.exports = router;
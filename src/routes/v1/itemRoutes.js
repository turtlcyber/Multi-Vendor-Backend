const express = require('express');
const router = express.Router();

const { 
    addItems, 
    getAllItems, 
    addUpdateItemImages, 
    updateItemById, 
    deleteItemById, 
    deleteItemImages, 
    getItemsBySearchKeywords, 
    getItemsByLocationOrSearchData,
    getItemById,
} = require('../../controllers/itemController');

// ADD ITEMS
router.post("/api/v1/addItem/:userId", addItems);

// ADD / UPDATE ITEM IMAGES
router.post("/api/v1/updateItemImages/:itemId", addUpdateItemImages);

// GET ALL ITEMS
router.get("/api/v1/getAllItems/:userId", getAllItems);

// GET ITEM BY ID
router.get("/api/v1/viewProductWithRestaurant/:itemId/:userId", getItemById);

// GET ITEMS BY SEARCH DATA
router.get("/api/v1/allItemSearchByKeywords/:categoryId?", getItemsBySearchKeywords);

// UPDATE ITEM BY ID
router.put("/api/v1/updateItem/:itemId", updateItemById);

// DELETE ITEM BY ID
router.delete("/api/v1/deleteItem/:itemId", deleteItemById);

// DELETE ITEM IMAGE
router.delete("/api/v1/deleteItemImage/:itemId/:imageId", deleteItemImages);

// GET ITEMS BY LOCATION OR SEARCH DATA
router.get("/api/v1/getItemByLocationOrSearchData/:BY_LOCATION?", getItemsByLocationOrSearchData);

module.exports = router;
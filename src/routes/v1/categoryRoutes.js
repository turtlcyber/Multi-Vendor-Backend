const express = require('express');
const router = express.Router();

const { addCategory, getCategoryById, getAllCategories, updateCategory, deleteCategory } = require('../../controllers/categoryController');

// ADD CATEGORY
router.post("/api/v1/addCategory", addCategory);

// GET CATEGORY BY ID WITH ALL PRODUCTS
router.get("/api/v1/getCategory/:categoryId", getCategoryById);

// GET ALL CATEGORIES
router.get("/api/v1/getAllCategories", getAllCategories);

// UPDATE CATEGORY
router.put("/api/v1/updateCategory/:categoryId", updateCategory);

// DELETE CATEGORY
router.delete("/api/v1/deleteCategory/:categoryId", deleteCategory);

module.exports = router;
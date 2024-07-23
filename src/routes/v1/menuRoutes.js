const express = require('express');
const router = express.Router();

const { addMenu, getAllMenus, getMenuById, updateMenu, deleteMenu  } = require('../../controllers/menuController');

// ADD MENU
router.post("/api/v1/addMenu/:userId", addMenu);

// GET ALL MENUS
router.get("/api/v1/getAllMenus/:userId", getAllMenus);

// GET MENU BY MENU ID
router.get("/api/v1/getMenu/:menuId", getMenuById);

// UPDATE MENU BY MENU ID
router.put("/api/v1/updateMenu/:menuId", updateMenu);

// DELETE MENU BY MENU ID
router.delete("/api/v1/deleteMenu/:menuId", deleteMenu);


module.exports = router;
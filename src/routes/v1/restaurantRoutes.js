const express = require('express');
const router = express.Router();

const {
    authenticateAdmin,
    updateRestaurantDatails,
    addUpdateLogo,
    getAllRestaurants,
    getRestaurantById,
    deleteRestaurant,
    getRestaurantsByLocation,
    getRestaurantBySearchData, 
    
} = require('../../controllers/restaurantController');

// AUTHENTICATE USER
router.post("/api/v1/authenticateRestaurant", authenticateAdmin);

// GET USER BY ID
router.get("/api/v1/viewRestaurant/:userId", getRestaurantById);

// GET ALL USERS
router.get("/api/v1/getAllRestaurants", getAllRestaurants);

// GET RESTAURANTS BY LOCATION OR ADDRESS
router.get("/api/v1/getRestaurantByLocation/:BY_LOCATION?/:BY_ADDRESS?", getRestaurantsByLocation);

// GET RESTAURANTS BY SEARCH DATA
router.get("/api/v1/allRestaurantSearchByKeywords/:categoryId", getRestaurantBySearchData);

// UPDATE USER
router.post("/api/v1/updateRestaurant/:userId", updateRestaurantDatails);

// ADD UPDATE LOGO
router.post("/api/v1/updateLogo/:userId", addUpdateLogo);

// DELETE USER BY USER ID
router.delete("/api/v1/deleteRestaurant/:userId", deleteRestaurant);


module.exports = router;
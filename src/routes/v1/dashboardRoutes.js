const express = require('express');
const router = express.Router();

const { getDashboard, getAllBannerImages, updateBannerImages, deleteBannerImage } = require('../../controllers/dashboard');

// GET DASHBOARD
router.get("/api/v1/getDashboard/:userId?", getDashboard);

// GET ALL BANNERS OF A RESTAURANT
router.get("/api/v1/getBanners/:userId", getAllBannerImages);

// ADD/UPDATE BANNER IMAGES
router.put("/api/v1/addOrUpdateBanner/:userId", updateBannerImages);

// DELETE BANNER IMAGE
router.delete("/api/v1/deleteBanner/:imageId/:userId", deleteBannerImage);


module.exports = router;
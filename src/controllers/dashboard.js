const restaurantModel = require('../models/restaurantModel');
const { getCurrentIPAddress } = require("../utils/utils");

const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port, adminSecretKey } = require("../config/config");
const { isValidObjectId } = require("mongoose");
const logger = require('../config/loggerConfig1');
const { stack } = require('../routes/v1/itemRoutes');

// DASHBOARD API
const getDashboard = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "UserId is required"});
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Restaurant not found"});
        };

        let bannerImages = restaurant.banners;

        return res.status(200).send({
            status: true,
            message: "Success",
            banners: bannerImages
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
        logger.error(`Error in getDashboard API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET ALL BANNER IMGAES
const getAllBannerImages = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required"});
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Restaurant not found"});
        };

        let bannerImages = restaurant.banners;

        return res.status(200).send({
            status: true,
            message: "Success",
            banners: bannerImages
        });

    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date.toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };
        logger.error(`Error in getAllBannerImages API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// UPDATE BANNER IMAGES
const updateBannerImages = async (req, res) => {
    try {
        let { userId } = req.params;
        if (!userId) {
            return res.status(400).send({ status: false, message: "Bad Request!!!" });
        }

        // if (key !== adminSecretKey) {
        //     return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        // }

        let restaurant = await restaurantModel.findOne({userId});

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Restaurant Not found"});
        };

        let { ImageModel } = req.body;

        let parsedData = JSON.parse(ImageModel);

        let bannerImage = req.files.bannerImage;

        if (!bannerImage) {
            return res.status(400).send({ status: false, message: "No banner image uploaded" });
        }

        let index = parsedData.index; //{"isNewPick":false,"index":1,"img_id":"64ffebc1f3bfc5d77220193b","imageName":"1694493633669-432139964.jpg"}
        let img_id = parsedData.img_id ? parsedData.img_id : "";
        let imageName = parsedData.imageName;
        let isNewPick = parsedData.isNewPick;

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/bannerImages/";
        let imgUniqName = uuid.v4() + "." + bannerImage.name.split(".").pop();
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "bannerImages", imgUniqName);

        if (!isNewPick) {
            let oldImage = restaurant.banners[index].imageName;
            let oldImgPath = path.join(__dirname, "..", "..", "bannerImages", oldImage);

            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            };
            
            bannerImage.mv(imgSavingPath, (err) => {
                if (err) throw err;
            });

            let updatedBannerObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            restaurant.banners[index] = updatedBannerObj;

            await restaurant.save();

            return res.status(200).send({
                status: true,
                message: "Banner updated successfully",
                banners: restaurant.banners,
            });
        } else {
            bannerImage.mv(imgSavingPath, (err) => {
                if (err) throw err;
            });

            let newBannerObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            // bannerObj.bannerImages.push(newBannerObj);
            restaurant.banners.push(newBannerObj);

            await restaurant.save();

            return res.status(200).send({
                status: true,
                message: "Banner added successfully",
                banners: restaurant.banners,
            });
        }
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additioanl details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };
        logger.error(`Error in updateBannerImages API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    };
};

// DELETE BANNER IMAGE BY ID
const deleteBannerImage = async (req, res) => {
    try {
        let { userId, imageId } = req.params;
        if (!userId || !imageId ) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        };

        // if (key !== adminSecretKey) {
        //     return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        // };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Not Found!!!" });
        }

        if (restaurant.banners.length) {
            for (let i = 0; i < restaurant.banners.length; i++) {
                if (imageId === restaurant.banners[i]._id.toString()) {
                    let arr = restaurant.banners;
                    arr.splice(i, 1);
                    restaurant.banners = arr;

                    await restaurant.save();
                };
            };
        };

        return res.status(200).send({
            status: true,
            message: "Banner deleted successfully",
            banners: restaurant.banners,
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
        logger.error(`Error in deleteBannerImage API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};


module.exports = {
    getDashboard,
    updateBannerImages,
    deleteBannerImage,
    getAllBannerImages
};

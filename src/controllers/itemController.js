const itemModel = require("../models/itemModel");
const restaurantModel = require("../models/restaurantModel");
const ratingModel = require('../models/ratingModel');
const { calculateDistance } = require("./restaurantController");

const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { getCurrentIPAddress, generateRandomAlphaNumericID } = require("../utils/utils");
const { port } = require("../config/config");
const { isValidObjectId } = require("mongoose");

const { adminSecretKey } = require("../config/config");
const logger = require("../config/loggerConfig1");

// ADD ITEMS IN MENU
const addItems = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "User Id is required" });
        }

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Restaurant Not Found" });
        }

        let { menuId, item_name, menuName, description, selling_price, isTaxable, preparing_time, notes, visit_count, status, seo_keywords, video_link, isVeg } = req.body;

        let itemData = {
            userId,
            menuId,
            item_name,
            menuName,
            description,
            selling_price,
            isTaxable,
            preparing_time,
            notes,
            visit_count,
            status,
            seo_keywords,
            video_link: video_link ? video_link : "",
            isVeg,
        };

        let product = await itemModel.create(itemData);

        // Calculate average rating and total rating counts
        const ratings = await ratingModel.aggregate([
            { $match: { productId: product._id } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$customers.rating" },
                    totalRatingCount: { $sum: 1 },
                },
            },
        ]);

        const averageRating = ratings.length > 0 ? ratings[0].averageRating : 0;
        const totalRatingCount = ratings.length > 0 ? ratings[0].totalRatingCount : 0;

        // Update the averageRating and totalRatingCount fields in the product
        product.averageRating = averageRating;
        product.totalRatingCount = totalRatingCount;
        await product.save();

        return res.status(200).send({
            status: true,
            message: "Item Added Successfully",
            product,
            averageRating,
            totalRatingCount,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// ADD / UPDATE ITEM IMAGES
const addUpdateItemImages = async (req, res) => {
    try {
        let { itemId } = req.params;

        if (!itemId) {
            return res.status(400).send({ status: false, message: "Item Id is required" });
        }

        if (!isValidObjectId(itemId)) {
            return res.status(400).send({ status: false, message: "Invalid itemId" });
        }

        let item = await itemModel.findById(itemId);

        if (!item) {
            return res.status(400).send({ status: false, message: "Item Not Found" });
        }

        let { ImageModel } = req.body;

        let parsedData = JSON.parse(ImageModel);

        let itemImage = req.files.itemImage;

        if (!itemImage) {
            return res.status(400).send({ status: false, message: "No item image uploaded" });
        }

        let { index, img_id, imageName, isNewPick } = parsedData;

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/itemImages/";
        let imgUniqName = uuid.v4() + "." + itemImage.name.split(".").pop();
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "itemImages", imgUniqName);

        if (!isNewPick) {
            let oldImageName = item.item_images[index].imgName;
            let oldImagePath = path.join(__dirname, "..", "..", "itemImages", oldImageName);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            itemImage.mv(imgSavingPath, (err) => {
                if (err) throw err;
            });

            let imgObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            item.item_images[index] = imgObj;

            await item.save();

            return res.status(200).send({
                status: true,
                message: "Item image updated successfully",
                data: item.item_images,
            });
        } else {
            itemImage.mv(imgSavingPath, (err) => {
                if (err) throw err;
            });

            let newImgObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            item.item_images.push(newImgObj);

            await item.save();

            return res.status(200).send({
                status: true,
                message: "Item image added successfully",
                data: item.item_images,
            });
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// DELETE ITEM IMAGES
const deleteItemImages = async (req, res) => {
    try {
        let { itemId, imageId } = req.params;

        if ((!itemId, !imageId)) {
            return res.status(400).send({ status: false, message: "all fields are required" });
        }

        let item = await itemModel.findById(itemId);

        if (!item) {
            return res.status(400).send({ status: false, message: "Item not found" });
        }

        if (item.item_images.length) {
            for (let i = 0; i < item.item_images.length; i++) {
                if (imageId === item.item_images[i]._id.toString()) {
                    let arr = item.item_images;
                    arr.splice(i, 1);
                    item.item_images = arr;
                    await item.save();
                }
            }
        }

        return res.status(200).send({
            status: true,
            message: "Image deleted successfully",
            data: item.item_images,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL ITEMS
const getAllItems = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "UserId is required" });
        }

        let items = await itemModel.find({ userId });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: items,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ITEM BY ITEM ID
const getItemById = async (req, res) => {
    try {
        const { itemId, userId } = req.params;

        if (!itemId || !userId) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        if (!isValidObjectId(itemId)) {
            return res.status(400).send({ status: false, message: "Invalid Item Id" });
        }

        let item = await itemModel.findById(itemId);

        if (!item) {
            return res.status(400).send({ status: false, message: "Item Not Found" });
        }

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "restaurant Not Found" });
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            restaurant,
            product: item,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in authenticateAdmin API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ITEMS BY SEARCH KEYWORDS
const getItemsBySearchKeywords = async (req, res) => {
    try {
        let { categoryId } = req.params;

        let { search_data } = req.body;

        if (categoryId) {
            let items = await itemModel.find({ categoryId });

            return res.status(200).send({
                status: true,
                message: "Success",
                data: items,
            });
        } else {
            let filter = {
                $or: [
                    { item_name: { $regex: search_data, $options: i } },
                    { description: { $regex: search_data, $options: i } },
                    { menuName: { $regex: search_data, $options: i } },
                    { isVeg: { $regex: search_data, $options: i } },
                ],
            };

            let items = await itemModel.find(filter);

            return res.status(200).send({
                status: true,
                message: "Success",
                data: items,
            });
        }
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in getItemsBySearchKeywords API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ITEM BY LOCATION OR SEARCH DATA
const getItemsByLocationOrSearchData = async (req, res) => {
    try {
        let { BY_LOCATION } = req.params;

        let e = req.body;

        let { search_data } = e;

        if (!BY_LOCATION && !search_data) {
            let items = await itemModel.aggregate([{ $sample: { size: 10 } }]);

            return res.status(200).send({
                status: true,
                message: "success",
                data: items,
            });
        } else if (BY_LOCATION && !search_data) {
            let latitude = e.latitude ? e.latitude : null;
            let longitude = e.longitude ? e.longitude : null;

            let allRestaurants = await restaurantModel.find({});

            let itemArr = [];

            if (allRestaurants.length) {
                for (let restaurant of allRestaurants) {
                    let distance = null;
                    let items = [];
                    if (latitude && longitude && restaurant.location.latitude && restaurant.location.longitude) {
                        distance = calculateDistance(latitude, longitude, restaurant.location.latitude, restaurant.location.longitude);
                    }

                    items = await itemModel.find({}).limit(5);

                    let itemObj = {
                        items,
                        distance,
                    };

                    itemArr.push(itemObj);
                }

                itemArr.sort((a, b) => a.distance - b.distance);

                console.log("inside location block", itemArr);

                // let items = [];
                // for (let item of itemArr) {
                //     items.push(...item.items);
                // }

                return res.status(200).send({
                    status: true,
                    message: "success",
                    data: itemArr,
                });
            }
        } else if (!BY_LOCATION && search_data) {
            let filter = {
                $or: [
                    { item_name: { $regex: search_data, $options: i } },
                    { description: { $regex: search_data, $options: i } },
                    { menuName: { $regex: search_data, $options: i } },
                    { isVeg: { $regex: search_data, $options: i } },
                ],
            };

            let items = await itemModel.find(filter);

            return res.status(200).send({
                status: true,
                message: "Success",
                data: items,
            });
        } else if (BY_LOCATION && search_data) {
            let latitude = e.latitude ? e.latitude : null;
            let longitude = e.longitude ? e.longitude : null;

            let allRestaurants = await restaurantModel.find({});

            let itemArr = [];
            if (allRestaurants.length) {
                for (let restaurant of allRestaurants) {
                    let distance = null;
                    let items = [];
                    if (latitude && longitude && restaurant.location.latitude && restaurant.location.longitude) {
                        distance = calculateDistance(latitude, longitude, restaurant.location.latitude, restaurant.location.longitude);
                        // console.log("items", items);
                    }

                    let filter = {
                        $or: [
                            { item_name: { $regex: search_data, $options: "i" } },
                            { description: { $regex: search_data, $options: "i" } },
                            { menuName: { $regex: search_data, $options: "i" } },
                            { isVeg: { $regex: search_data, $options: "i" } },
                        ],
                    };

                    items = await itemModel.find(filter).limit(5);

                    let itemObj = {
                        items,
                        distance,
                    };

                    itemArr.push(itemObj);
                }

                itemArr.sort((a, b) => a.distance - b.distance);

                // console.log("Inside both data", itemArr);

                let items = [];
                for (let item of itemArr) {
                    items.push(...item.items);
                }

                return res.status(200).send({
                    status: true,
                    message: "success",
                    data: items,
                });
            }
        };
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in getItemsByLocationOrSearchData API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};


// UPDATE ITEM BY ITEM ID
const updateItemById = async (req, res) => {
    try {
        let { itemId } = req.params;

        if (!itemId) {
            return res.status(400).send({ status: false, message: "Item Id is required" });
        }

        if (!isValidObjectId(itemId)) {
            return res.status(400).send({ status: false, message: "Invalid Item Id" });
        }

        let item = await itemModel.findById(itemId);

        if (!item) {
            return res.status(400).send({ status: false, message: "Item Not Found" });
        }

        let e = req.body;

        if ("item_name" in e) {
            item.item_name = e.item_name;
        }

        if ("description" in e) {
            item.description = e.description;
        }

        if ("selling_price" in e) {
            item.selling_price = e.selling_price;
        }

        if ("isTaxable" in e) {
            item.isTaxable = e.isTaxable;
        }

        if ("preparing_time" in e) {
            item.preparing_time = e.preparing_time;
        }

        if ("notes" in e) {
            item.notes = e.notes;
        }

        if ("visit_count" in e) {
            item.visit_count = e.visit_count;
        }

        if ("status" in e) {
            item.status = e.status;
        }

        if ("seo_keywords" in e) {
            item.seo_keywords = e.seo_keywords;
        }

        if ("video_link" in e) {
            item.video_link = e.video_link;
        }

        if ("isVeg" in e) {
            item.isVeg = e.isVeg;
        }

        await item.save();

        return res.status(200).send({
            status: true,
            message: "Item Updated Successfully",
            data: item,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in updateItemById API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// DELETE ITEM BY ITEM ID
const deleteItemById = async (req, res) => {
    try {
        const { itemId } = req.params;

        if (!itemId) {
            return res.status(400).send({ status: false, message: "Item Id is required" });
        }

        if (!isValidObjectId(itemId)) {
            return res.status(400).send({ status: false, message: "Invalid Item Id" });
        }

        let item = await itemModel.findById(itemId);

        if (!item) {
            return res.status(400).send({ status: false, message: "Item Not Found" });
        }

        let oldImgName = item.item_images.imgName;

        if (oldImgName) {
            let oldImgPath = path.join(__dirname, "..", "..", "items", oldImgName);

            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            }
        }

        await itemModel.deleteOne({ _id: itemId });

        return res.status(200).send({
            status: true,
            message: "Item deleted successfully",
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in deleteItemById API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

module.exports = {
    addItems,
    addUpdateItemImages,
    deleteItemImages,
    getAllItems,
    getItemById,
    getItemsBySearchKeywords,
    updateItemById,
    deleteItemById,
    getItemsByLocationOrSearchData,
};

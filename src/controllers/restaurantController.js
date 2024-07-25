const restaurantModel = require("../models/restaurantModel");
const deletedUserModel = require("../models/deleteUserModel");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { getCurrentIPAddress, generateRandomAlphaNumericID } = require("../utils/utils");
const { port } = require("../config/config");
const { isValidObjectId } = require("mongoose");

const { adminSecretKey } = require("../config/config");
const BadRequest = require("../errors/badRequestError");
const NotFound = require("../errors/notFoundError");
const logger = require("../config/loggerConfig1");
const itemModel = require("../models/itemModel");
const menuModel = require("../models/menuModel");

// LOGIN USER
const authenticateAdmin = async (req, res) => {
    try {
        let { userId, userName, email, profilePic } = req.body;

        const isUserExists = await restaurantModel.findOne({ userId });

        if (!isUserExists) {
            let userObj = {
                userId,
                userName,
                email,
                profilePic,
            };

            let newUser = await restaurantModel.create(userObj);
            return res.status(200).send({
                status: true,
                message: "Authentication successful",
                data: newUser,
            });
        } else {
            return res.status(200).send({
                status: true,
                message: "Authentication successful",
                data: isUserExists,
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

        logger.error(`Error in authenticateAdmin API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// REGISTER/UPDATE RESTAURANT
const updateRestaurantDatails = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            // return res.status(400).send({ status: false, message: "userId is required"});
            throw new BadRequest(userId, "userId is required");
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            // return res.status(400).send({
            //     status: false,
            //     message: "Restaurant not found",
            // });
            throw NotFound("restaurant", userId);
        };

        let reqBody = req.body;

        if ("userName" in reqBody) {
            restaurant.userName = reqBody.userName;
        };

        if ("restaurantName" in reqBody) {
            restaurant.restaurantName = reqBody.restaurantName;
        };

        if ("mobile" in reqBody) {
            restaurant.mobile = reqBody.mobile;
        };

        if ("description" in reqBody) {
            restaurant.description = reqBody.description;
        };

        if ("restaurant_address" in reqBody) {
            if ("address" in reqBody.restaurant_address) {
                restaurant.restaurant_address.address = reqBody.restaurant_address.address;
            };

            if ("apartment" in reqBody.restaurant_address) {
                restaurant.restaurant_address.apartment = reqBody.restaurant_address.apartment;
            };

            if ("city" in reqBody.restaurant_address) {
                restaurant.restaurant_address.city = reqBody.restaurant_address.city;
            };

            if ("post_code" in reqBody.restaurant_address) {
                restaurant.restaurant_address.post_code = reqBody.restaurant_address.post_code;
            };

            if ("state" in reqBody.restaurant_address) {
                restaurant.restaurant_address.state = reqBody.restaurant_address.state;
            };
        };

        if ("slug" in reqBody) {
            let allRestaurant = await restaurantModel.find();

            for (let obj of allRestaurant) {
                if (reqBody.slug === obj.slug) {
                    return res.status(200).send({
                        status: false, 
                        message: "This slug is duplicate, please provide a new slug"
                    });
                }
            };
            restaurant.slug = reqBody.slug;
        };

        if ("sitting_capacity" in reqBody) {
            restaurant.sitting_capacity = reqBody.sitting_capacity;
        };

        if ("isVeg" in reqBody) {
            restaurant.isVeg = reqBody.isVeg;
        };

        if ("max_allow_seating" in req.body) {
            restaurant.max_allow_seating = reqBody.max_allow_seating;
        };

        if ("contact_number" in reqBody) {
            restaurant.contact_number = reqBody.contact_number;
        };

        if ("contact_person" in reqBody) {
            restaurant.contact_person = reqBody.contact_person;
        };

        if ("website" in reqBody) {
            restaurant.website = reqBody.website;
        };

        if ("rating_review_url" in reqBody) {
            restaurant.rating_review_url = reqBody.rating_review_url;
        };

        if ("GST_number" in reqBody) {
            restaurant.GST_number = reqBody.GST_number;
        };

        if ("isActive" in reqBody) {
            restaurant.isActive = reqBody.isActive;
        };

        await restaurant.save();

        return res.status(200).send({
            status: true,
            message: "Restaurant updated successfully",
            data: restaurant,
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

        if (error instanceof BadRequest) {
            logger.error(`Error in updateRestaurantDatails API: Bad Request(Client Side Error). ${error.message}`, { meta: metadata });
            return res.status(400).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof NotFound) {
            logger.error(`Error in updateRestaurantDatails API: Not Found Error. ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        logger.error(`Error in updateRestaurantDatails API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// ADD OR UPDATE LOGO
const addUpdateLogo = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required"});
            // throw new BadRequest(userId, "Please provide the userId");
        }

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({
                status: false,
                message: "Restaurant not found",
            });
            // throw new NotFound("restaurant", userId);
        }

        let { File_Extension, File_Path, File_data, File_name } = req.body;

        // console.log("reqbody", req.body);

        let decodedData = Buffer.from(File_data, "base64");

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/logoImages/";
        let imgUniqName = uuid.v4() + File_Extension;
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "logoImages", imgUniqName);

        let oldImgName = restaurant.logo.fileName;

        if (oldImgName) {
            let oldImgPath = path.join(__dirname, "..", "..", "logoImages", oldImgName);

            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            }
        }

        fs.writeFileSync(imgSavingPath, decodedData);

        let logoObj = {
            fileName: imgUniqName,
            filePath: imgFullUrl,
        };

        restaurant.logo = logoObj;

        await restaurant.save();

        return res.status(200).send({
            status: true,
            message: "logo updated successfully",
            logo: restaurant.logo,
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

        logger.error(`Error in addUpdateLogo API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET USER BY ID
const getRestaurantById = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            // return res.status(400).send({ status: false, message: "userId is required"});
            throw new BadRequest(userId, "userId is required");
        }

        // if (key !== adminSecretKey) {
        //     return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!"});
        // };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            // return res.status(400).send({
            //     status: false,
            //     message: "Restaurant not found",
            // });

            throw new NotFound("restaurant", userId);
        }

        let itemList = await itemModel.find({ userId});

        let menuList = await menuModel.find({ userId });

        return res.status(200).send({
            status: true,
            message: "Success",
            restaurant,
            itemList,
            menuList
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

        if (error instanceof BadRequest) {
            logger.error(`Error in getRestaurantById API: Bad Request(Client Side Error). ${error.message}`, { meta: metadata });
            return res.status(400).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof NotFound) {
            logger.error(`Error in getRestaurantById API: Not Found Error. ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        logger.error(`Error in getRestaurantById API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL USERS
const getAllRestaurants = async (req, res) => {
    try {
        // let { key } = req.params;

        // if (!key) {
        //     return res.status(400).send({ status: false, message: "key is required" });
        // }

        // if (key !== adminSecretKey) {
        //     return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        // }

        let restaurants = await restaurantModel.aggregate([{ $sample: { size: 10 } }]);

        return res.status(200).send({
            status: true,
            message: "Success",
            data: restaurants,
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
        logger.error(`Error in getAllRestaurants API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};

// function to calculate the distance between two sets of latitude and longitude coordinates
// (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius (mean radius) in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    let d = distance.toFixed(2);
    let roundedDistance = parseFloat(d);
    return roundedDistance;
}

// GET RESTAURANTS BY ADDRESS OR LOCATION
const getRestaurantsByLocation = async (req, res) => {
    try {
        let { BY_LOCATION, BY_ADDRESS } = req.params;

        let e = req.body;

        if (BY_LOCATION) {
            let latitude = e.latitude ? e.latitude : null;
            let longitude = e.longitude ? e.longitude : null;
            let range = e.range ? e.range : 5;

            let allRestaurants = await restaurantModel.find({});

            let restaurantArr = [];

            if (allRestaurants.length) {
                for (let restaurant of allRestaurants) {
                    let distance;
                    if (latitude && longitude && restaurant.location.latitude && restaurant.location.longitude) {
                        distance = calculateDistance(latitude, longitude, restaurant.location.latitude, restaurant.location.longitude);
                    }

                    if (distance <= range) {
                        restaurantArr.push(restaurant);
                    }
                }
            }

            if (restaurantArr.length === 0) {
                return res.status(400).send({
                    status: false,
                    message: "No restaurant found",
                });
            }

            return res.status(200).send({
                status: true,
                message: "Success",
                data: restaurantArr,
            });
        } else {
            let { address, apartment, city } = e;
            const filter = {};

            if (address) {
                filter["restaurant_address.address"] = { $regex: address, $options: "i" };
            }

            if (apartment) {
                filter["restaurant_address.apartment"] = { $regex: apartment, $options: "i" };
            }

            if (city) {
                filter["restaurant_address.city"] = { $regex: city, $options: "i" };
            }

            const restaurants = await restaurantModel.find(filter);

            if (restaurants.length === 0) {
                return res.status(400).send({
                    status: false,
                    message: "No restaurant found",
                });
            }

            return res.status(200).send({
                status: true,
                message: "Success",
                data: restaurants,
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
        logger.error(`Error in getRestaurantByLocation API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET RESTAURANTS BY SEARCH DATA
const getRestaurantBySearchData = async (req, res) => {
    try {
        let { categoryId } = req.params;

        let { search_data } = req.body;

        if (categoryId) {
            let restaurants = await restaurantModel.find({ categoryId });

            return res.status(200).send({
                status: true,
                message: "Success",
                data: restaurants,
            });
        } else {
            let filter = {
                $or: [
                    { restaurantName: { $regex: search_data, $options: i }},
                    { description: { $regex: search_data, $options: i } },
                    { isVeg: { $regex: search_data, $options: i }}
                ]
            };

            let restaurants = await restaurantModel.find(filter);

            return res.status(200).send({
                status: true,
                message: "Success",
                data: restaurants,
            });
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
        logger.error(`Error in getRestaurantBySearchData API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};


// DELETE USER
const deleteRestaurant = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" });
        }

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({
                status: false,
                message: "Restaurant not found",
            });
        }

        const { reason, feedback } = req.body;

        let restaurantData = {
            restaurant,
        };

        let jsonStr = JSON.stringify(restaurantData);

        await restaurantModel.deleteOne({ userId });

        let deletedUserData = {
            userId,
            deletedRestaurantData: jsonStr,
            reason,
            feedback,
            deletedAt: new Date().toLocaleString(),
        };

        await deletedUserModel.create(deletedUserData);

        return res.status(200).send({
            status: true,
            message: "Restaurant deleted successfully",
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
        logger.error(`Error in deleteRestaurant API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};


module.exports = {
    authenticateAdmin,
    updateRestaurantDatails,
    addUpdateLogo,
    deleteRestaurant,
    getRestaurantById,
    getRestaurantsByLocation,
    getRestaurantBySearchData,
    getAllRestaurants,
    calculateDistance
};

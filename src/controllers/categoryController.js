const categoryModel = require("../models/categoryModel");
const itemModel = require("../models/itemModel");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const { getCurrentIPAddress } = require("../utils/utils");
const { port } = require("../config/config");
const { isValidObjectId } = require("mongoose");

const NotFound = require("../errors/notFoundError");
const BadRequest = require("../errors/badRequestError");
const InternalServerError = require("../errors/internalServerError");
const logger = require("../config/loggerConfig1");

// ADD CATEGORY
const addCategory = async (req, res) => {
    try {
        let { name, description } = req.body;

        let { category_image } = req.files;

        if (!category_image) {
            // return res.status(400).send({ status: false, message: "No category image uploaded"});
            throw new BadRequest("No category image uploaded", "category_image");
        }

        let currApAddress = getCurrentIPAddress();
        let imgRelativePath = "/categoryImages/";
        let imgUniqName = uuid.v4() + "." + category_image.name.split(".").pop();
        let imgUrl = `http://${currApAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "categoryImages", imgUniqName);

        category_image.mv(imgSavingPath, (err) => {
            if (err) throw err;
        });

        let imgObj = {
            fileName: imgUniqName,
            filePath: imgUrl,
        };

        let categoryObj = {
            name,
            description,
            category_image: imgObj,
        };

        let newCategory = await categoryModel.create(categoryObj);

        return res.status(201).send({
            status: true,
            message: "Success",
            data: newCategory,
        });
    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        if (error instanceof BadRequest) {
            logger.error(`Error in Add Category API: Bad Request. ${error.message}`, { meta: metadata });
            return res.status(400).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof InternalServerError) {
            logger.error(`Error in Add Category API: Internal Server Error. ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof NotFound) {
            logger.error(`Error in Add Category API: Not Found Error. ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        logger.error(`Error in Add Category API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
    try {
        let { categoryId } = req.params;

        if (!categoryId) {
            // return res.status(400).send({ status: false, message: "categoryId is required"});
            throw new BadRequest(categoryId, "Please provide the categoryId");
        }

        if (!isValidObjectId(categoryId)) {
            // return res.status(400).send({ status: false, message: "Invalid categoryId"});
            throw new BadRequest(categoryId, "Invalid categoryId");
        };

        let category = await categoryModel.findById(categoryId);

        if (!category) {
            // return res.status(400).send({ status: false, message: "Category not found"});
            throw new NotFound("Category", categoryId);
        }

        let allItems = await itemModel.find({ categoryId: category._id });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: category,
            products: allItems,
        });
    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        if (error instanceof BadRequest) {
            logger.error(`Error in Get Category API: Bad Request. ${error.message}`, { meta: metadata });
            return res.status(400).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof InternalServerError) {
            logger.error(`Error in Get Category API: Internal Server Error. ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof NotFound) {
            logger.error(`Error in Get Category API: Not Found Error. ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        logger.error(`Error in Get Category API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};


// GET ALL CATEGORIES
const getAllCategories = async (req, res) => {
    try {
        let categories = await categoryModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: categories,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            // return res.status(400).send({ status: false, message: "categoryId is required"});
            throw new BadRequest(categoryId, "Please provide the categoryId");
        }

        if (!isValidObjectId(categoryId)) {
            // return res.status(400).send({ status: false, message: "Invalid categoryId"});
            throw new BadRequest(categoryId, "Invalid categoryId");
        }

        let c = await categoryModel.findById(categoryId);

        if (!c) {
            // return res.status(400).send({ status: false, message: "Category not found"});
            throw new NotFound("category", categoryId);
        }

        let e = req.body;

        if ("name" in e) {
            c.name = e.name;
        }

        if ("description" in e) {
            c.description = e.description;
        }

        if ("category_image" in e || (req.files && req.files.category_image)) {
            let { category_image } = req.files;

            if (!category_image) {
                // return res.status(400).send({ status: false, message: "No category image uploaded"});
                throw new BadRequest(category_image, "No category image uploaded");
            }

            let oldImgName = c.category_image.fileName;
            let oldImgPath = path.join(__dirname, "..", "..", "categoryImages", oldImgName);

            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            }

            let currApAddress = getCurrentIPAddress();
            let imgRelativePath = "/categoryImages/";
            let imgUniqName = uuid.v4() + "." + category_image.name.split(".").pop();
            let imgPath = `http://${currApAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "categoryImages", imgUniqName);

            category_image.mv(imgSavingPath, (err) => {
                if (err) throw err;
            });

            let imgObj = {
                fileName: imgUniqName,
                filePath: imgPath,
            };

            c.category_image = imgObj;
        }

        await c.save();

        return res.status(200).send({
            status: true,
            message: "Category updated successfully",
            data: c,
        });
    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        if (error instanceof BadRequest) {
            logger.error(`Error in Update Category API: Bad Request(Client Side Error). ${error.message}`, { meta: metadata });
            return res.status(400).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof InternalServerError) {
            logger.error(`Error in Update Category API: Internal Server Error(Server Side Error). ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof NotFound) {
            logger.error(`Error in Update Category API: Not Found Error. ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        logger.error(`Error in Update Category API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        let { categoryId } = req.params;

        if (!categoryId) {
            // return res.status(400).send({ status: false, message: "catrgory Id is required"});
            throw new BadRequest(categoryId, "Please provide the categoryId");
        }

        if (!isValidObjectId(categoryId)) {
            // return res.status(400).send({ status: false, messge: "Invalid categoryId"});
            throw new BadRequest(categoryId, "Invalid categoryId");
        }

        let category = await categoryModel.findById(categoryId);

        if (!category) {
            // return res.status(400).send({ status: false, message: "Category not found"});
            throw new NotFound("category", categoryId);
        }

        let categoryImgName = category.category_image.fileName;
        let categoryImgPath = path.join(__dirname, "..", "..", "categoryImages", categoryImgName);

        if (fs.existsSync(categoryImgPath)) {
            fs.unlinkSync(categoryImgPath);
        }

        await categoryModel.deleteOne({ _id: categoryId });

        return res.status(200).send({
            status: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        if (error instanceof BadRequest) {
            logger.error(`Error in Delete Category API: Bad Request(Client Side Error). ${error.message}`, { meta: metadata });
            return res.status(400).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof InternalServerError) {
            logger.error(`Error in Delete Category API: Internal Server Error(Server Side Error). ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        if (error instanceof NotFound) {
            logger.error(`Error in Delete Category API: Not Found Error. ${error.message}`, { meta: metadata });
            return res.status(500).send({ status: false, message: error.message, details: error.details });
        }

        logger.error(`Error in Delete Category API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {
    addCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory,
};

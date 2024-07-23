const adminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const logger = require('../config/loggerConfig1');
const { isValidObjectId } = require('mongoose');


// AUTHENTICATION
const Authentication = async (req, res) => {
    try {
        let authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).send({
                status: false,
                message: "Authorization header with Bearer token is required"
            });
        };

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(400).send({
                status: false,
                message: "Invalid token format"
            });
        };

        jwt.verify(token, tokenSecretKey, (err, decodedToken) => {
            if (err) {
                return res.status(401).send({
                    status: false,
                    message: "Invalid token"
                });
            };

            req.adminId = decodedToken.adminId;
            next();
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
        logger.error(`Error in Authentication middleware: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    };
};


// AUTHORIZATION
const Authorization = async (req, res) => {
    try {
        const tokenId = req.adminId;

        const { adminId  } = req.params;

        if (!isValidObjectId(adminId)) {
            return res.status(400).send({ status: false, message: "Invalid adminId"});
        };

        let admin = await adminModel.findById(adminId);

        if (!admin) {
            return res.status(400).send({ status: false, message: "Admin not found"});
        };

        if (tokenId.toString() !== admin._id.toString()) {
            return res.status(403).send({
                status: false,
                message: "Not authorized"
            });
        };

        next();
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };
        logger.error(`Error in Authorization middleware: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

 
module.exports = {
    Authentication,
    Authorization
};
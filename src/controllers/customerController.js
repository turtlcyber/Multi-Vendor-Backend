const customerModel = require("../models/customerModel");
const logger = require("../config/loggerConfig1");

// LOGIN CUSTOMER
const loginCustomer = async (req, res) => {
    try {
        let { customerId, dialingCode, mobile, HCFToken } = req.body;

        let customer = await customerModel.findOne({
            customerId: customerId,
            mobile: mobile,
        });

        if (!customer) {
            let loginData = {
                customerId,
                dialingCode,
                mobile,
                HCFToken,
            };

            let newcustomerData = await customerModel.create(loginData);

            return res.status(200).send({
                status: true,
                message: "Login successfully",
                loginData: newcustomerData,
            });
        } else {
            return res.status(200).send({
                status: true,
                message: "Login successfully",
                loginData: customer,
            });
        }
    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };
        logger.error(`Error in loginCustomer API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET ALL CUSTOMER
const getAllCustomers = async (req, res) => {
    try {
        let customers = await customerModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: customers,
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
        logger.error(`Error in loginCustomer API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET CUSTOMER BY ID
const getCustomerById = async (req, res) => {
    try {
        let { customerId } = req.params;

        if (!customerId) {
            return res.status(400).send({
                status: false,
                message: "customerId is required",
            });
        }

        let customer = await customerModel.findOne({ customerId });

        if (!customer) {
            return res.status(404).send({ status: false, message: "customer not found" });
        }

        return res.status(200).send({
            status: true,
            message: "Success",
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
        logger.error(`Error in loginCustomer API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

// UPDATE CUSTOMER
const updateCustomerById = async (req, res) => {
    try {
        let { customerId } = req.params;

        if (!customerId) {
            return res.status(400).send({
                status: false,
                message: "customerId is required",
            });
        }

        let customer = await customerModel.findOne({ customerId });

        if (!customer) {
            return res.status(404).send({ status: false, message: "Customer Not found" });
        }

        let body = req.body;

        if ("name" in body) {
            customer.name = body.name;
        }

        if ("email" in body) {
            customer.email = body.email;
        }

        if ("gender" in body) {
            customer.gender = body.gender;
        }

        if ("DOB" in body) {
            customer.DOB = body.DOB;
        }

        if ("address" in body) {
            customer.address = body.address;
        }

        await customer.save();

        return res.status(200).send({ status: true, message: "success", data: customer });
    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };
        logger.error(`Error in loginCustomer API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};


// DELETE CUSTOMER BY CUSTOMER ID
const deleteCustomerById = async (req, res) => {
    try {
        let { customerId } = req.params;

        let { question, feedback } = req.body;

        let customer = await customerModel.findOne({ customerId });

        if (!customer) {
            return res.status(404).send({ status: false, message: "Customer not found" });
        }

        let deleteCustomer = await customerModel.deleteOne({customerId});
        if (!deleteCustomer) {
            return res.status(404).send({ status: false, message: "Customer already deleted" });
        }

        return res.status(200).send({
            status: true,
            message: "customer deleted successfully",
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
        logger.error(`Error in loginCustomer API: ${error.message}`, { meta: metadata });
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {
    loginCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomerById,
    deleteCustomerById
};

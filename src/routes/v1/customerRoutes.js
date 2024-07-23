const express = require('express');
const router = express.Router();

const { loginCustomer, updateCustomerById, getAllCustomers, getCustomerById, deleteCustomerById } = require('../../controllers/customerController');

// LOGIN CUSTOMER
router.post("/api/v1/logincustomer", loginCustomer);

// GET ALL CUSTOMERS
router.get("/api/v1/getAllCustomers", getAllCustomers);

// GET CUSTOMER BY ID
router.get("/api/v1/getCustomerById/:customerId", getCustomerById);

// UPDATE CUSTOMER BY ID
router.put("/api/v1/updatecustomer/:customerId", updateCustomerById);

// DELETE CUSTOMER
router.delete("/api/v1/deleteaccount/:customerId", deleteCustomerById);


module.exports = router;
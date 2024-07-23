const { StatusCodes } = require('http-status-codes');
const BaseError = require('./baseError');

class Unauthorized extends BaseError {
    constructor(message, details = "") {
        super(message, details);
        this.name = "Unauthorized";
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
};

module.exports = Unauthorized;
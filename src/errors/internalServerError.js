
const { StatusCodes } = require('http-status-codes');
const BaseError = require('./baseError');

class InternalServerError extends BaseError {
    constructor (details) {
        super("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR , 'Something Went Wrong', details, );
    }
};

module.exports = InternalServerError;
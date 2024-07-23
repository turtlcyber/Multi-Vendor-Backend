const { StatusCodes } = require('http-status-codes');
const BaseError = require('./baseError');

class NotFound extends BaseError {
    constructor(resourceName, resourceValue) {
        super("Not Found", StatusCodes.NOT_FOUND, `The requested resource ${resourceName} with value ${resourceValue} not found`, {
            resourceName,
            resourceValue
        });
    };
};

module.exports = NotFound;
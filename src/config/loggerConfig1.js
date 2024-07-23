const winston = require('winston');
require('winston-mongodb');
const { mongoDBUri } = require('./config');

const allowedTransports = [];

// // The below transport config enables logging on the console
// allowedTransports.push(new winston.transports.Console({
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
//         winston.format.printf((log) => `${log.timestamp} [${log.level}]: [${log.message}] ${log.meta ? JSON.stringify(log.meta) : ''}`)
//     )
// }));

// MongoDB transport
allowedTransports.push(new winston.transports.MongoDB({
    level: 'error',
    db: mongoDBUri,
    collection: 'logs',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format((info) => {
            info.meta = info.meta || {};
            return info;
        })()
    ),
    options: {
        useUnifiedTopology: true
    }
}));

// The below transport config enables logging in a file
allowedTransports.push(new winston.transports.File({
    filename: 'app.log'
}));

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((log) => `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message} ${log.meta? JSON.stringify(log.meta) : ''}`)
    ),
    transports: allowedTransports,
    defaultMeta: { service: 'user-service' }
});

// console.log("logger:", logger);

module.exports = logger;

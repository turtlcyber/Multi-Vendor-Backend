const winston = require('winston');
require('winston-mongodb');
const { mongoDBUri } = require('./config');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.metadata({ key: 'meta', fillExcept: ['message', 'level', 'timestamp', 'service'] }),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        // new winston.transports.Console({
        //     format: winston.format.combine(
        //         winston.format.colorize(),
        //         winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message} ${info.meta ? JSON.stringify(info.meta) : ''}`)
        //     )
        // }),
        new winston.transports.File({
            filename: 'app.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.MongoDB({
            level: 'error',
            db: mongoDBUri,
            collection: 'logs',
            options: { useUnifiedTopology: true },
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

module.exports = logger;

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
// const xss = require('xss');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const { port } = require('./src/config/config');
const errorHandler = require('./src/utils/errorHandler');
const { connectToDatabase } = require('./src/config/dbConfig');
const logger = require('./src/config/loggerConfig1');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
// app.use(xss());
app.use(mongoSanitize());
app.use(hpp()); // HTTP Parameter Pollution prevention
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(fileUpload());

const adminRoutes = require('./src/routes/v1/adminRoutes');
const categoryRoutes = require('./src/routes/v1/categoryRoutes');
const customerRoutes = require('./src/routes/v1/customerRoutes');
const dashboardRoutes = require('./src/routes/v1/dashboardRoutes');
const itemRoutes = require('./src/routes/v1/itemRoutes');
const menuRoutes = require('./src/routes/v1/menuRoutes');
const orderRoutes = require('./src/routes/v1/orderRoutes');
const ratingRoutes = require('./src/routes/v1/ratingRoutes');
const restaurantRoutes = require('./src/routes/v1/restaurantRoutes');
const tableRoutes = require('./src/routes/v1/tableRoutes');

// Content Security Policy
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    })
);

// HTTP Strict Transport Security (HSTS)
app.use(
    helmet.hsts({
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    })
);


// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});

app.use(limiter);

// app.use("/userImages", express.static(__dirname + "/userImages"));
app.use("/categoryImages", express.static(__dirname + "/categoryImages"));
app.use("/bannerImages", express.static(__dirname + "/bannerImages"));
app.use("/itemImages", express.static(__dirname + "/itemImages"));
app.use("/menuImages", express.static(__dirname + "/menuImages"));
app.use("/logoImages", express.static(__dirname + "/logoImages"));

app.use("/", adminRoutes);
app.use("/", categoryRoutes);
app.use("/", customerRoutes);
app.use("/", dashboardRoutes);
app.use("/", itemRoutes);
app.use("/", menuRoutes);
app.use("/", orderRoutes);
app.use("/", ratingRoutes);
app.use("/", restaurantRoutes);
app.use("/", tableRoutes);

app.get("/", (req, res) => {
    res.send("<h1>Multi Vender App is Up and Running</h1>");
});

// Last middleware if any error comes
app.use(errorHandler);

const server = app.listen(port, async() => {
    console.log('App is running on port', port);
    // logger.info('Server started on port ' + port, { meta: { timestamp: new Date().toISOString() } });
    await connectToDatabase;
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Close the server and exit the process
    server.close(() => {
        process.exit(1);
    });
});

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    // Close the server and exit the process
    server.close(() => {
        process.exit(1);
    });
});

// Handling process termination signals for graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
const adminModel = require("../models/adminModel");
const logger = require('../config/loggerConfig1');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const path = require("path");
const fs = require('fs');
const { getCurrentIPAddress, generateRandomAlphaNumericID } = require("../utils/utils");
const { port, tokenSecretKey } = require("../config/config");
const NotFound = require("../errors/notFoundError");
const BadRequest = require("../errors/badRequestError");
const InternalServerError = require("../errors/internalServerError");
const Unauthorized = require('../errors/unauthorized');


// ADD ADMIN
const createAdmin = async (req, res) => {
    try {
        let { name, email, password, mobile, gender, date_of_birth } = req.body;

        if (!name || !email || !password || !mobile) {
            throw new BadRequest("Missing required fields", "name, email, password, mobile");
        }

        let picObj = null;
        if ("profilePic" in req.body || (req.files && req.files.profilePic)) {
            let { profilePic } = req.files;

            if (!profilePic) {
                throw new BadRequest("No profile pic uploaded");
            }

            let hashedPassword = await bcrypt.hash(password, 10);
            password = hashedPassword;

            let currentIpAddress = getCurrentIPAddress();
            let profilePicPath = "/adminImages/";
            let profilePicName = uuid.v4() + "." + profilePic.name.split(".").pop();
            let profilePicFullPath = `http://${currentIpAddress}:${port}${profilePicPath}`;

            let adminImgFolder = path.join(__dirname, "..", "..", "adminImages");

            if (!fs.existsSync(adminImgFolder)) {
                fs.mkdirSync(adminImgFolder);
            };

            let picSavingPath = path.join(adminImgFolder, profilePicName);

            await profilePic.mv(picSavingPath, (err) => {
                if (err) {
                    throw err;
                }
            });

            picObj = {
                fileName: profilePicName,
                filePath: profilePicFullPath,
            };
        }

        let adminObj = {
            adminId: generateRandomAlphaNumericID(26),
            sessionToken: generateRandomAlphaNumericID(51),
            name,
            email,
            password,
            mobile,
            gender,
            date_of_birth,
            profilePic: picObj,
        };

        let newAdmin = await adminModel.create(adminObj);

        return res.status(201).send({
            status: true,
            message: "Admin created",
            data: newAdmin,
        });
    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };

        logger.error(`Error in CreateAdmin API: ${error.message}`, { meta: metadata });

        if (error instanceof BadRequest || error instanceof NotFound) {
            return res.status(error.statusCode).send({ status: false, message: error.message, details: error.details });
        }

        const serverError = new InternalServerError(error.message);
        return res.status(500).send({ status: false, message: serverError.message });
    }
};


const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequest("Missing required fields", "email, password");
        }

        let admin = await adminModel.findOne({ email });
        if (!admin) {
            throw new BadRequest("Bad Request!!!", "Invalid email or password");
        }

        bcrypt.compare(password, admin.password, async function (error, result) {
            try {
                if (error) {
                    return res.status(401).send({ status: false, message: error.message });
                }

                if (result) {
                    let data = {};
                    let date = Date.now();
                    let issueTime = Math.floor(date / 1000);
                    let token = jwt.sign(
                        {
                            email: admin.email,
                            adminId: admin._id.toString(),
                            iat: issueTime,
                        },
                        tokenSecretKey,
                        { expiresIn: "24h" }
                    );
                    data._id = admin._id.toString();
                    data.email = email;
                    data.token = token;

                    res.setHeader("Authorization", "Bearer " + token);

                    admin.sessionToken = generateRandomAlphaNumericID(51);
                    await admin.save();

                    return res.status(200).send({
                        status: true,
                        message: "Successfully login",
                        data: data,
                    });
                } else {
                    throw new Unauthorized("Login denied", "Invalid email or password");
                }
            } catch (error) {
                const metadata = {
                    stack: error.stack,
                    details: error.details || "No additional details provided",
                    timestamp: new Date().toISOString(),
                    ip: req.ip,
                    method: req.method,
                    url: req.originalUrl
                };

                logger.error(`Error in AdminLogin API => ${error.message}`, { meta: metadata });

                if (error instanceof BadRequest || error instanceof Unauthorized) {
                    return res.status(error.statusCode).send({ status: false, message: error.message, details: error.details });
                }

                const serverError = new InternalServerError(error.message);
                return res.status(500).send({ status: false, message: serverError.message });
            }
        });

    } catch (error) {
        const metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        };

        logger.error(`Error in AdminLogin API: ${error.message}`, { meta: metadata });

        if (error instanceof BadRequest) {
            return res.status(error.statusCode).send({ status: false, message: error.message, details: error.details });
        }

        const serverError = new InternalServerError(error.message);
        return res.status(500).send({ status: false, message: serverError.message });
    }
};


// GET ALL BOOKINGS OF AN USER
const getAllBookingsOfUser = async (req, res) => {
    try {
        const { adminId, sessionToken, userId } = req.params;

        if (!adminId || !sessionToken) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        let admin = await adminModel.findOne({ adminId, sessionToken });

        if (!admin) {
            return res.status(404).send({ status: false, message: "Bad Reques!!!" });
        }

        if (admin.adminId === adminId && admin.sessionToken === sessionToken) {
            let user = await userModel.findOne({ userId });

            if (!user) {
                return res.status(404).send({ status: false, message: "User Not Found" });
            }

            let userAllBookings = await bookingModel.find({ userId });

            return res.status(200).send({
                status: true,
                message: "Success",
                data: userAllBookings,
            });
        } else {
            return res.status(400).send({ status: false, message: "Session Expired" });
        }
    } catch (error) {
        logger.error(`Get All Bookings of User API: Internal Server Error. \n${error}`);
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET ONE DAY REQUESTS
const getOneDayBookings = async (req, res) => {
    try {
        const { adminId, sessionToken } = req.params;

        if (!adminId || !sessionToken) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        let admin = await adminModel.findOne({ adminId, sessionToken });

        if (!admin) {
            return res.status(404).send({ status: false, message: "Bad Reques!!!" });
        }

        if (admin.adminId === adminId && admin.sessionToken === sessionToken) {
            let date;
            if (req.params.date) {
                date = req.params.date;
            } else {
                let today = new Date(); // Use today's date if no date is provided
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month
                const day = String(today.getDate()).padStart(2, "0");

                date = `${year}-${month}-${day}`;
            }

            let oneDayBookings = await bookingModel.find({ BookingDate: date });

            let grandTotal = 0;
            for (let booking of oneDayBookings) {
                grandTotal += booking.grand_total;
            };

            let data = {
                totalBookings: oneDayBookings,
                oneDayRevenue: grandTotal,
            };

            return res.status(200).send({
                status: true,
                message: "Success",
                data: data,
            });
        } else {
            return res.status(400).send({ status: false, message: "Session Expired" });
        };
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET ONE WEEK REQUESTS
const getOneWeekBookings = async (req, res) => {
    try {
        let { adminId, sessionToken } = req.params;

        if (!adminId || !sessionToken) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        let admin = await adminModel.findOne({ adminId, sessionToken });
        if (!admin) {
            return res.status(404).send({ status: false, message: "Bad Reques!!!" });
        }

        if (admin.adminId === adminId && admin.sessionToken === sessionToken) {
            let startDate;
            let endDate;

            if (req.params.startDate && req.params.endDate) {
                startDate = req.params.startDate;
                endDate = req.params.endDate;
            } else {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month
                const day = String(date.getDate()).padStart(2, "0");

                endDate = `${year}-${month}-${day}`;

                const oneWeekAgo = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
                const startYear = oneWeekAgo.getFullYear();
                const startMonth = String(oneWeekAgo.getMonth() + 1).padStart(2, "0");
                const startDay = String(oneWeekAgo.getDate()).padStart(2, "0");

                startDate = `${startYear}-${startMonth}-${startDay}`;
            }

            let oneWeekBookings = await bookingModel.find({
                BookingDate: { $gte: startDate, $lte: endDate },
            });

            let grandTotal = 0;
            if (oneWeekBookings.length) {
                for (let booking of oneWeekBookings) {
                    grandTotal += booking.grand_total;
                }
            }

            let data = {
                oneWeekBookings: oneWeekBookings,
                grandTotal: grandTotal,
            };

            return res.status(200).send({
                status: true,
                message: "Success",
                data: data,
            });
        } else {
            return res.status(403).send({ status: false, message: "Session Expired" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET ONE MONTH REVENUE AND REQUESTS (ADMIN API)
const getOneMonthBookings = async (req, res) => {
    try {
        const { adminId, sessionToken, month, year } = req.params;

        if (!adminId || !sessionToken || !month || !year) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        let admin = await adminModel.findOne({ adminId, sessionToken });

        if (!admin) {
            return res.status(404).send({ status: false, message: "Bad Reques!!!" });
        }

        if (admin.adminId === adminId && admin.sessionToken === sessionToken) {
            const startDate = `${year}-${month}-01`; // Month is zero-based index
            const endDate = `${year}-${month}-31`;

            const oneMonthBookings = await bookingModel.find({
                createdAt: { $gte: startDate, $lte: endDate },
            });

            let grandTotal = 0;

            if (oneMonthBookings.length) {
                for (let booking of oneMonthBookings) {
                    grandTotal += booking.grand_total;
                }
            }

            let data = {
                oneMonthBookings: oneMonthBookings,
                oneMonthRevenue: grandTotal,
            };

            return res.status(200).send({
                status: true,
                message: "Success",
                data: data,
            });
        } else {
            return res.status(400).send({ status: false, message: "Session Expired" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

// GET ONE YEAR REQUESTS AND REVENUE (ADMIN API);
const getOneYearBookings = async (req, res) => {
    try {
        const { adminId, sessionToken, year } = req.params;
        if (!adminId || !sessionToken || !year) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        let admin = await adminModel.findOne({ adminId, sessionToken });

        if (!admin) {
            return res.status(404).send({ status: false, message: "Bad Reques!!!" });
        }

        if (admin.adminId === adminId && admin.sessionToken === sessionToken) {
            const startDate = `${year}-01-01`; // January 1st of the provided year
            const endDate = `${year}-12-31`; // December 31st of the provided year

            let oneYearBookings = await bookingModel.find({
                createdAt: { $gte: startDate, $lte: endDate },
            });

            let grandTotal = 0;
            if (oneYearBookings.length) {
                for (let booking of oneYearBookings) {
                    grandTotal += booking.grand_total;
                }
            }

            let data = {
                oneYearRequests: oneYearBookings,
                oneYearRevenue: grandTotal,
            };

            return res.status(200).send({
                status: true,
                message: "Success",
                data: data,
            });
        } else {
            return res.status(400).send({ status: false, message: "Session Expired" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {
    createAdmin,
    adminLogin,
    getAllBookingsOfUser,
    getOneDayBookings,
    getOneWeekBookings,
    getOneMonthBookings,
    getOneYearBookings,
};

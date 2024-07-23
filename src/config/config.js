const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT,
    adminSecretKey: process.env.ADMIN_SECRET_KEY,
    mongoDBUri: process.env.MONGO_DB_URL,
    tokenSecretKey: process.env.TOKEN_SECRET_KEY
};
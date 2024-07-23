const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
    {
        adminId: {
            type: String,
            unique: true,
            default: ""
        },

        sessionToken: {
            type: String,
        },

        name: {
            type: String,
            trim: true,
        },

        profilePic: {
            fileName: { type: String },
            filePath: { type: String }
        },

        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER", "UNDEFINED"],
            default: "UNDEFINED",
        },

        password: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            default: ""
        },

        mobile: {
            type: String,
            default: ""
        },

        date_of_birth: {
            type: String,
            default: ""
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", userSchema);

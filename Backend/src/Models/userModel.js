const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    userPassword: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    userAddress: {
        type: String,
        required: true,
        trim: true,
    },
    userContact: {
        type: String,
        required: true,
        unique: true,
    },
    Gender: {
        type: String,
        enum: ["male", "female", "others"],
        required: true,
        trim: true,
        lowercase: true,
    },
    Age: {
        type: Number,
        required: true,
    },
},
    { timestamps: true }
);

module.exports = new mongoose.model("user", userSchema);
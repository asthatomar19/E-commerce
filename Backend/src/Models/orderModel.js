const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            }
        }
    ],
    totalItems: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"],
        default: "pending",
        required: true,
        trim: true,
        lowercase: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "successfull", "failed"],
        required: true,
        trim: true,
        lowercase: true,
    },
    shippingAddress: {
        type: String,
        required: true,
        trim: true,
    },
    orderAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = new mongoose.model("order", orderSchema);
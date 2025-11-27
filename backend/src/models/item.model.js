const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["to_read", "reading", "finished"],
        default: "to_read"
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    tags: {
        type: [String],
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Item", itemSchema);
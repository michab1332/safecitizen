import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 20
    },
    description: {
        type: String,
        required: true
    },
    location: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        place: {
            type: String,
        }
    },
    userId: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: "noPhoto"
    }
}, { timestamps: true });

export default mongoose.model("Alert", AlertSchema, "alerts");
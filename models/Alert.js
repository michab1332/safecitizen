import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
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
        adress: {
            type: String,
            required: true
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
});

export default mongoose.model("Alert", AlertSchema, "alerts");
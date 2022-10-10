import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    numberOfAlerts: {
        type: Number,
        default: 0
    },
    alerts: {
        type: [String],
        default: []
    }
});

export default mongoose.model("User", UserSchema, "users");
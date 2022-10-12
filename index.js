import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouters from "./routes/auth.js";
import userRouters from "./routes/user.js";
import alertRouters from "./routes/alert.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("connected to database")
        })
        .catch(err => { throw err })
}

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouters);
app.use("/api/user", userRouters);
app.use("/api/alert", alertRouters);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    });
});

app.listen(8800, () => {
    console.log("connected to server");
    connect();
});
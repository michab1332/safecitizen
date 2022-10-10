import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouters from "./routes/auth.js"

const app = express();
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("connected to database")
        })
        .catch(err => { throw err })
}

app.use("/api/auth", authRouters);

app.listen(8800, () => {
    console.log("connected to server");
    connect();
});
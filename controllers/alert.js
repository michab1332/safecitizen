import Alert from "../models/Alert.js";
import User from "../models/User.js";

export const addAlert = async (req, res, next) => {
    const newAlert = new Alert({ ...req.body, userId: req.user.id });
    try {
        await newAlert.save();
        await User.findByIdAndUpdate(req.user.id, {
            $push: { alerts: newAlert._id }
        })
        res.status(200).json("Alert has been created");
    } catch (err) {
        next(err);
    }
}

export const deleteAlert = async (req, res, next) => {
    try {


    } catch (err) {
        next(err);
    }
}
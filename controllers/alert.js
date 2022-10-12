import { createError } from "../error.js";
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
        const alert = await Alert.findById(req.params.id);
        if (!alert) return next(createError(404, "Alert not found"));

        if (alert.userId === req.user.id) {
            await Alert.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete alert successful");
        } else {
            return next(createError("You can delete only your alert"));
        }
    } catch (err) {
        next(err);
    }
}
import { createError } from "../error.js";
import User from "../models/User.js";

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        const { pasword, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        next(err);
    }
}
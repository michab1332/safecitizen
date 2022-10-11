import express from "express";
import { getUser } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);

export default router;
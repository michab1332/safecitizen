import express from "express";
import { verifyToken } from "../verifyToken.js";
import { addAlert, deleteAlert } from "../controllers/alert.js";

const router = express.Router();

router.post("/add", verifyToken, addAlert);

router.delete("/:id", verifyToken, deleteAlert);

export default router;
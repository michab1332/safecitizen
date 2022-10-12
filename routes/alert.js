import express from "express";
import { verifyToken } from "../verifyToken.js";
import { addAlert, deleteAlert, getAlert } from "../controllers/alert.js";

const router = express.Router();

router.post("/add", verifyToken, addAlert);

router.delete("/:id", verifyToken, deleteAlert);

router.get("/:id", verifyToken, getAlert);

export default router;
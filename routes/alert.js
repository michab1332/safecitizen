import express from "express";
import { verifyToken } from "../verifyToken.js";
import { addAlert, deleteAlert, getAlert, getAlerts, getAlertsByAdress } from "../controllers/alert.js";

const router = express.Router();

router.get("/all", getAlerts);

router.get("/search", getAlertsByAdress);

router.get("/:id", getAlert);

router.post("/add", verifyToken, addAlert);

router.delete("/:id", verifyToken, deleteAlert);

export default router;
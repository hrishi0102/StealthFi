import express from "express";
import {
  getPreferences,
  storePreferences,
} from "../controllers/nillionController.js";

const router = express.Router();

router.get("/preferences/:address", getPreferences);
router.post("/preferences", storePreferences);

export default router;

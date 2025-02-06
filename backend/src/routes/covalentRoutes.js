import express from "express";
import { getAgentResponse } from "../controllers/covalentController.js";

const router = express.Router();
router.post("/chat-defi", getAgentResponse);
export default router;

import { Router } from "express";
import { handleChatMessage } from "./chat.controllers";

const router = Router();

// Route for sending a chat message to the LLM
router.post("/", handleChatMessage);

export default router;

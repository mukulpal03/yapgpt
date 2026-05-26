import { Router, type Router as ExpressRouter } from "express";
import { handleChatMessage } from "./chat.controllers";

const router: ExpressRouter = Router();

router.post("/", handleChatMessage);

export default router;

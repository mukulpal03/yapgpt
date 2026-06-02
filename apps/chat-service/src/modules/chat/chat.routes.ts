import { Router, type Router as ExpressRouter } from "express";
import { handleChatMessage } from "./chat.controllers";
import { authenticate } from "../auth/auth.middleware";

const router: ExpressRouter = Router();

router.use(authenticate);

router.post("/", handleChatMessage);

export default router;

import { Request, Response, NextFunction } from "express";
import { ChatService } from "./chat.services";

const chatService = new ChatService();

export async function handleChatMessage(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { message } = req.body;

        if (message === undefined || message === null) {
            res.status(400).json({
                success: false,
                error: "Bad Request: 'message' field is required in request body."
            });
            return;
        }

        if (typeof message !== "string") {
            res.status(400).json({
                success: false,
                error: "Bad Request: 'message' must be a string."
            });
            return;
        }

        if (message.trim().length === 0) {
            res.status(400).json({
                success: false,
                error: "Bad Request: 'message' content cannot be empty."
            });
            return;
        }

        const reply = await chatService.processUserMessage(message);

        res.status(200).json({
            success: true,
            response: reply
        });
    } catch (error) {
        next(error);
    }
}

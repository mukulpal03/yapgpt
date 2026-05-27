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

        const result = await chatService.processUserMessage(message);

        if (!result.success) {
            const statusCode = result.code === "validation_error" ? 400 : 502;
            res.status(statusCode).json({
                success: false,
                error: result.error,
                ...(result.code ? { code: result.code } : {}),
            });
            return;
        }

        res.status(200).json({
            success: true,
            response: result.reply
        });
    } catch (error) {
        next(error);
    }
}

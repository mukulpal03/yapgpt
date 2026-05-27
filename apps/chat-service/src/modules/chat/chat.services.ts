import { generateLLMResponse } from "@repo/metadata-sdk";

export type ChatResult =
  | { success: true; reply: string }
  | { success: false; error: string; code?: string };

export class ChatService {
  async processUserMessage(message: string): Promise<ChatResult> {
    if (!message || typeof message !== "string" || message.trim() === "") {
      return {
        success: false,
        error: "Message content cannot be blank.",
        code: "validation_error",
      };
    }

    const result = await generateLLMResponse(message);

    if (!result.success) {
      return {
        success: false,
        error: result.error.message,
        code: result.error.code,
      };
    }

    return {
      success: true,
      reply: result.outputText,
    };
  }
}

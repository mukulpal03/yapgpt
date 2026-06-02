import { generateLLMResponse } from "@repo/metadata-sdk";
import { createConversation, createMessage } from "./chat.repository";
import type { NewConversation } from "@repo/database/schema";

export type ChatResult =
  | { success: true; reply: { role: "assistant"; content: string } }
  | { success: false; error: string; code?: string };

export class ChatService {
  async processUserMessage(
    userId: NonNullable<NewConversation["userId"]>,
    message: string,
  ): Promise<ChatResult> {
    if (!message || typeof message !== "string" || message.trim() === "") {
      return {
        success: false,
        error: "Message content cannot be blank.",
        code: "validation_error",
      };
    }

    const conversation = await createConversation(userId);

    if (!conversation) {
      return {
        success: false,
        error: "Failed to create conversation.",
        code: "database_error",
      };
    }

    await createMessage(conversation.id, "user", message);

    const result = await generateLLMResponse(message);

    if (!result.success) {
      return {
        success: false,
        error: result.error.message,
        code: result.error.code,
      };
    }

    await createMessage(
      conversation.id,
      "assistant",
      result.assistantResponse?.content ?? "",
    );

    return {
      success: true,
      reply: result.assistantResponse,
    };
  }
}

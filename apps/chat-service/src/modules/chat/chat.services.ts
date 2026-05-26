import { callLLMWithMetadata } from "@repo/metadata-sdk";

export class ChatService {
  async processUserMessage(message: string): Promise<string> {
    if (!message || typeof message !== "string" || message.trim() === "") {
      throw new Error("Message content cannot be blank.");
    }

    try {
      const response = await callLLMWithMetadata(message);

      //   if (!response) {
      //     throw new Error("No response received from the LLM.");
      //   }
      return "response";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`LLM Error: ${error.message}`);
      }
      throw new Error("An unexpected error occurred during LLM processing.");
    }
  }
}

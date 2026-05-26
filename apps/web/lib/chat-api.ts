import { apiClient } from "./api-client";

export interface ChatMessageResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const response = await apiClient.post<ChatMessageResponse>("/api/chat", {
      message,
    });
    
    if (response.data.success && response.data.response) {
      return response.data.response;
    } else {
      throw new Error(response.data.error || "Failed to receive a valid response from the AI backend.");
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || "An unexpected error occurred while communicating with the backend.";
    throw new Error(errorMessage);
  }
}

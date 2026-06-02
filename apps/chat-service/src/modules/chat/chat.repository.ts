import { db, conversations, messages, eq } from "@repo/database";
import type {
  NewMessage,
  Conversation,
  Message,
  MessageRole,
  NewConversation,
} from "@repo/database/schema";

export async function createConversation(
  userId: NonNullable<NewConversation["userId"]>,
): Promise<Pick<Conversation, "id">> {
  const [conversation] = await db
    .insert(conversations)
    .values({ userId })
    .returning({
      id: conversations.id,
    });

  if (!conversation) {
    throw new Error("Failed to create conversation.");
  }

  return conversation;
}

export async function createMessage(
  conversationId: NonNullable<NewMessage["conversationId"]>,
  role: MessageRole,
  content: string,
): Promise<
  Pick<Message, "id" | "conversationId" | "role" | "content" | "createdAt">
> {
  const [message] = await db
    .insert(messages)
    .values({ conversationId, role, content })
    .returning({
      id: messages.id,
      conversationId: messages.conversationId,
      role: messages.role,
      content: messages.content,
      createdAt: messages.createdAt,
    });

  if (!message) {
    throw new Error("Failed to create message.");
  }

  return message;
}

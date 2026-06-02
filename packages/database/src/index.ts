export { db } from "./client.js";
export type { Database } from "./client.js";
export { eq } from "drizzle-orm";

export {
  inferenceLogs,
  type InferenceLog,
  type NewInferenceLog,
  type InputPreview,
  type OutputPreview,
  type IncompleteDetails,
  users,
  type User,
  type NewUser,
  conversations,
  type Conversation,
  type NewConversation,
  messages,
  type Message,
  type NewMessage,
  type MessageRole,
} from "./schema/index.js";

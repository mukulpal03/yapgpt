import {
  pgTable,
  timestamp,
  uuid,
  text,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { conversations } from "./conversation.js";

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").references(() => conversations.id),
    role: messageRoleEnum("role").default("user").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("messages_conversation_id_idx").on(table.conversationId)],
);

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
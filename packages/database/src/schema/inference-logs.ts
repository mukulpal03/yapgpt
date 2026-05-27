import {
  pgTable,
  uuid,
  varchar,
  integer,
  real,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export type InputPreview = {
  preview: string;
};

export type OutputPreview = {
  preview: string;
};

export type IncompleteDetails = {
  reason?: string;
  [key: string]: string | undefined;
};

export const inferenceLogs = pgTable(
  "inference_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    model: varchar("model", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 100 }).notNull(),

    inputTokens: integer("input_tokens").notNull(),
    outputTokens: integer("output_tokens").notNull(),
    totalTokens: integer("total_tokens").notNull(),

    latencyInMs: real("latency_in_ms").notNull(),

    input: jsonb("input").$type<InputPreview>().notNull(),
    output: jsonb("output").$type<OutputPreview>().notNull(),

    status: varchar("status", { length: 100 }).notNull(),

    errorMessage: text("error_message"),
    errorCode: varchar("error_code", { length: 100 }),

    incompleteDetails: jsonb("incomplete_details").$type<IncompleteDetails>(),

    requestStartedAt: timestamp("request_started_at", {
      withTimezone: true,
    }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull(),
    providerCreatedAt: timestamp("provider_created_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("inference_logs_provider_idx").on(table.provider),
    index("inference_logs_model_idx").on(table.model),
    index("inference_logs_status_idx").on(table.status),
    index("inference_logs_created_at_idx").on(table.createdAt),
    index("inference_logs_request_started_at_idx").on(table.requestStartedAt),
  ]
);

export type InferenceLog = typeof inferenceLogs.$inferSelect;
export type NewInferenceLog = typeof inferenceLogs.$inferInsert;

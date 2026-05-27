import { z } from "zod";

const previewSchema = z.object({
  preview: z.string().max(500),
});

const timestampsSchema = z.object({
  requestStartedAt: z.coerce.date(),
  completedAt: z.coerce.date(),
  providerCreatedAt: z.coerce.date().optional(),
});

export const inferenceLogsSchema = z.object({
  model: z.string().min(1),
  provider: z.string().min(1),
  latencyInMs: z.number().finite().nonnegative(),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
  input: previewSchema,
  output: previewSchema,
  timestamps: timestampsSchema,
  status: z.string().min(1),
  error: z.unknown().optional(),
  errorMessage: z.string().optional(),
  errorCode: z.string().optional(),
  incomplete_details: z.unknown().optional(),
});

export type InferenceLogs = z.infer<typeof inferenceLogsSchema>;

export function parseInferenceLogs(data: unknown) {
  return inferenceLogsSchema.safeParse(data);
}

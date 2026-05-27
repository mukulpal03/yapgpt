import type { InferenceLogs } from "@repo/validation";
import { db, inferenceLogs as inferenceLogsTable } from "@repo/database";

export class IngestService {
    async processInferenceLogs(log: InferenceLogs): Promise<void> {
        try {
            await db.insert(inferenceLogsTable).values({
                model: log.model,
                provider: log.provider,
                latencyInMs: log.latencyInMs,
                inputTokens: log.inputTokens,
                outputTokens: log.outputTokens,
                totalTokens: log.totalTokens,
                input: log.input,
                output: log.output,
                status: log.status,
                errorMessage: log.errorMessage ?? log.error?.message,
                errorCode: log.errorCode ?? log.error?.code,
                incompleteDetails: log.incomplete_details,
                requestStartedAt: log.timestamps.requestStartedAt,
                completedAt: log.timestamps.completedAt,
                providerCreatedAt: log.timestamps.providerCreatedAt,
            });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown database error";
            throw new Error(`Failed to persist inference logs: ${message}`);
        }
    }
}

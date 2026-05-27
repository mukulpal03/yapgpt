import type { InferenceLogs } from "@repo/validation";

export class IngestService {
    async processInferenceLogs(inferenceLogs: InferenceLogs): Promise<void> {
        console.log("[inference-logs]", inferenceLogs);
    }
}

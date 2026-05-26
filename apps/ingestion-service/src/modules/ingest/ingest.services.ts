import type { InferenceLogs } from "@repo/metadata-sdk";

export class IngestService {
  async processInferenceLogs(inferenceLogs: InferenceLogs): Promise<void> {
    console.log("[inference-logs]", inferenceLogs);
  }
}

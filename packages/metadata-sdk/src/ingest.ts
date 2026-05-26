import type { InferenceLogs } from "./types.js";

const DEFAULT_INGESTION_URL =
  process.env.INGESTION_SERVICE_URL || "http://localhost:3002/api/ingest";

export function sendInferenceLogs(inferenceLogs: InferenceLogs): void {
  const ingestionUrl =
    process.env.INGESTION_SERVICE_URL || DEFAULT_INGESTION_URL;

  void fetch(ingestionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inferenceLogs),
  }).catch((error) => {
    console.error("Failed to send inference logs to ingestion service:", error);
  });
}

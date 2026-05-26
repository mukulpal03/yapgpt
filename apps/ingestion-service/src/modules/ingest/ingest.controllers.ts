import { Request, Response, NextFunction } from "express";
import { IngestService } from "./ingest.services";

const ingestService = new IngestService();

export async function handleIngestLogs(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const inferenceLogs = req.body;

        if (inferenceLogs === undefined || inferenceLogs === null) {
            res.status(400).json({
                success: false,
                error: "Bad Request: inference logs payload is required in request body."
            });
            return;
        }

        if (typeof inferenceLogs !== "object" || Array.isArray(inferenceLogs)) {
            res.status(400).json({
                success: false,
                error: "Bad Request: inference logs must be a JSON object."
            });
            return;
        }

        await ingestService.processInferenceLogs(inferenceLogs);

        res.status(200).json({
            success: true,
            message: "Inference logs ingested successfully."
        });
    } catch (error) {
        next(error);
    }
}

import { Request, Response, NextFunction } from "express";
import { parseInferenceLogs } from "@repo/validation";
import { IngestService } from "./ingest.services";

const ingestService = new IngestService();

export async function handleIngestLogs(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const parsed = parseInferenceLogs(req.body);

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                error: "Bad Request: invalid inference logs payload.",
                details: parsed.error.flatten(),
            });
            return;
        }

        await ingestService.processInferenceLogs(parsed.data);

        res.status(200).json({
            success: true,
            message: "Inference logs ingested successfully."
        });
    } catch (error) {
        next(error);
    }
}

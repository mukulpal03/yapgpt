import { Router, type Router as ExpressRouter } from "express";
import { handleIngestLogs } from "./ingest.controllers";

const router: ExpressRouter = Router();

router.post("/", handleIngestLogs);

export default router;

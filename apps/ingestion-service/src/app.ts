import express, { Express } from 'express'
import cors from 'cors'
import ingestRoutes from './modules/ingest/ingest.routes';
import { ALLOWED_ORIGIN } from './config/constants';
import type { NextFunction, Request, Response, ErrorRequestHandler } from "express";

const app: Express = express();

app.use(express.json())

app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/ingest", ingestRoutes)

app.use((err: ErrorRequestHandler, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message,
  });
});

export default app;

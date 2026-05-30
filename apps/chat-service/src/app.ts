import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import chatRoutes from "./modules/chat/chat.routes";
import authRoutes from "./modules/auth/auth.routes";
import { ALLOWED_ORIGIN } from "./config/constants";
import type { NextFunction, Request, Response } from "express";
import { isAppError } from "./lib/errors";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (isAppError(err)) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.code ? { code: err.code } : {}),
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message:
      err instanceof Error ? err.message : "An unexpected error occurred.",
  });
});

export default app;

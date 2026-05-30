import type { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_COOKIE_NAME } from "../../config/cookies";
import { AppError } from "../../lib/errors";
import { verifyAccessToken } from "../../lib/jwt";

function extractBearerToken(authHeader: string | undefined): string | undefined {
  if (!authHeader?.startsWith("Bearer ")) {
    return undefined;
  }
  const token = authHeader.slice(7).trim();
  return token.length > 0 ? token : undefined;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const cookieToken = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
  const headerToken = extractBearerToken(req.headers.authorization);
  const token =
    typeof cookieToken === "string" && cookieToken.length > 0
      ? cookieToken
      : headerToken;

  if (!token) {
    next(
      new AppError(
        401,
        "Authentication required. Missing access token cookie or Authorization header.",
        "unauthorized"
      )
    );
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(
      new AppError(401, "Invalid or expired access token.", "invalid_token")
    );
  }
}

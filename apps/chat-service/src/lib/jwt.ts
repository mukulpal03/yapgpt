import jwt from "jsonwebtoken";
import { StringValue } from "ms";

export type JwtPayload = {
  sub: string;
  email: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }
  return secret;
}

function getJwtExpiresInSeconds(): StringValue {
  const duration = process.env.JWT_EXPIRES_IN ?? "7d";

  return duration as StringValue;
}

export function getAccessTokenCookieMaxAgeMs(): number {
  return Number(process.env.JWT_COOKIE_MAX_AGE_MS);
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresInSeconds(),
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload.");
  }

  const { sub, email } = decoded as Record<string, unknown>;

  if (typeof sub !== "string" || typeof email !== "string") {
    throw new Error("Invalid token payload.");
  }

  return { sub, email };
}

import type { CookieOptions } from "express";

export const ACCESS_TOKEN_COOKIE_NAME = "access_token";

function baseCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
  };
}

export function getAccessTokenCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    ...baseCookieOptions(),
    maxAge: maxAgeMs,
  };
}

export function getClearAccessTokenCookieOptions(): CookieOptions {
  return baseCookieOptions();
}

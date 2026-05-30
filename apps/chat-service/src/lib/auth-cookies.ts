import type { Response } from "express";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  getAccessTokenCookieOptions,
  getClearAccessTokenCookieOptions,
} from "../config/cookies";
import { getAccessTokenCookieMaxAgeMs } from "./jwt";

export function setAccessTokenCookie(res: Response, token: string): void {
  const maxAgeMs = getAccessTokenCookieMaxAgeMs();
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, token, getAccessTokenCookieOptions(maxAgeMs));
}

export function clearAccessTokenCookie(res: Response): void {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, getClearAccessTokenCookieOptions());
}

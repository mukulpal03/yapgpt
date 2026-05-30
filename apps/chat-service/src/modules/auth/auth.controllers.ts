import type { NextFunction, Request, Response } from "express";
import { parseLoginInput, parseRegisterInput } from "@repo/validation";
import {
  clearAccessTokenCookie,
  setAccessTokenCookie,
} from "../../lib/auth-cookies";
import { AuthService } from "./auth.services";

const authService = new AuthService();

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = parseRegisterInput(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid registration payload.",
        details: parsed.error.flatten(),
      });
      return;
    }

    const result = await authService.register(parsed.data);
    setAccessTokenCookie(res, result.token);

    res.status(201).json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = parseLoginInput(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid login payload.",
        details: parsed.error.flatten(),
      });
      return;
    }

    const result = await authService.login(parsed.data);
    setAccessTokenCookie(res, result.token);

    res.status(200).json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogout(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    authService.logout();
    clearAccessTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function handleMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Unauthorized.",
        code: "unauthorized",
      });
      return;
    }

    const user = await authService.getProfile(req.user.sub);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

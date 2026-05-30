import { isAxiosError } from "axios";

import { apiClient } from "./api-client";
import {
  AuthError,
  type AuthSuccessResponse,
  type LogoutSuccessResponse,
  type PublicUser,
  type ValidationErrorResponse,
} from "./auth.types";

function parseAuthError(error: unknown): AuthError {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | ValidationErrorResponse
      | { error?: string; code?: string }
      | undefined;

    if (data && typeof data === "object" && "details" in data) {
      return new AuthError(data.error, { fieldErrors: data.details.fieldErrors });
    }

    const message =
      data?.error ||
      error.message ||
      "An unexpected error occurred while communicating with the backend.";

    return new AuthError(message, { code: data?.code });
  }

  if (error instanceof Error) {
    return new AuthError(error.message);
  }

  return new AuthError("An unexpected error occurred.");
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<PublicUser> {
  try {
    const response = await apiClient.post<AuthSuccessResponse>(
      "/api/auth/login",
      credentials,
    );

    if (response.data.success && response.data.user) {
      return response.data.user;
    }

    throw new AuthError("Failed to sign in.");
  } catch (error) {
    throw parseAuthError(error);
  }
}

export async function registerUser(credentials: {
  email: string;
  password: string;
}): Promise<PublicUser> {
  try {
    const response = await apiClient.post<AuthSuccessResponse>(
      "/api/auth/register",
      credentials,
    );

    if (response.data.success && response.data.user) {
      return response.data.user;
    }

    throw new AuthError("Failed to create account.");
  } catch (error) {
    throw parseAuthError(error);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await apiClient.post<LogoutSuccessResponse>("/api/auth/logout");
  } catch (error) {
    throw parseAuthError(error);
  }
}

export async function getCurrentUser(): Promise<PublicUser> {
  try {
    const response = await apiClient.get<AuthSuccessResponse>("/api/auth/me");

    if (response.data.success && response.data.user) {
      return response.data.user;
    }

    throw new AuthError("Failed to load current user.");
  } catch (error) {
    throw parseAuthError(error);
  }
}

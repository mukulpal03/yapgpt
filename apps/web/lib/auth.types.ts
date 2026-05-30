export type PublicUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export type AuthSuccessResponse = {
  success: true;
  user: PublicUser;
};

export type LogoutSuccessResponse = {
  success: true;
  message: string;
};

export type AppErrorResponse = {
  success: false;
  error: string;
  code?: string;
};

export type ValidationErrorResponse = AppErrorResponse & {
  details: {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  };
};

export class AuthError extends Error {
  code?: string;
  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    options?: { code?: string; fieldErrors?: Record<string, string[]> },
  ) {
    super(message);
    this.name = "AuthError";
    this.code = options?.code;
    this.fieldErrors = options?.fieldErrors;
  }
}

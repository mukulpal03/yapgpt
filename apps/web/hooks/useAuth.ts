"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@repo/validation/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../lib/auth-api";
import { AuthError } from "../lib/auth.types";
import { useAuthStore } from "../stores/auth-store";

type AuthFormMode = "login" | "register";

type AuthFormOptions = {
  redirectTo?: string | null;
};

type BaseAuthReturn = {
  user: ReturnType<typeof useAuthStore.getState>["user"];
  status: ReturnType<typeof useAuthStore.getState>["status"];
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

type LoginAuthReturn = BaseAuthReturn & {
  form: UseFormReturn<LoginInput>;
  onSubmit: () => void;
  formError: string | null;
  isSubmitting: boolean;
};

type RegisterAuthReturn = BaseAuthReturn & {
  form: UseFormReturn<RegisterInput>;
  onSubmit: () => void;
  formError: string | null;
  isSubmitting: boolean;
};

function applyFieldErrors(
  form: UseFormReturn<LoginInput | RegisterInput>,
  fieldErrors?: Record<string, string[]>,
) {
  if (!fieldErrors) return;

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (!messages?.length) continue;

    form.setError(field as keyof (LoginInput | RegisterInput), {
      type: "server",
      message: messages[0],
    });
  }
}

export function useAuth(): BaseAuthReturn;
export function useAuth(mode: "login", options?: AuthFormOptions): LoginAuthReturn;
export function useAuth(mode: "register", options?: AuthFormOptions): RegisterAuthReturn;
export function useAuth(mode?: AuthFormMode, options?: AuthFormOptions) {
  const router = useRouter();
  const { user, status, setUser, setStatus, reset } = useAuthStore();
  const initStarted = useRef(false);

  const redirectAfterAuth = useCallback(() => {
    const redirectTo = options?.redirectTo;
    router.push(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/");
  }, [options?.redirectTo, router]);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  const initialize = useCallback(async () => {
    if (status !== "idle") return;

    setStatus("loading");

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
    } catch {
      reset();
    }
  }, [reset, setStatus, setUser, status]);

  const login = useCallback(
    async (data: LoginInput) => {
      setLoginError(null);
      setIsLoginSubmitting(true);

      try {
        const authenticatedUser = await loginUser(data);
        setUser(authenticatedUser);
        setStatus("authenticated");
        redirectAfterAuth();
      } catch (error) {
        if (error instanceof AuthError) {
          applyFieldErrors(loginForm, error.fieldErrors);
          setLoginError(error.message);
        } else {
          setLoginError("Failed to sign in.");
        }
      } finally {
        setIsLoginSubmitting(false);
      }
    },
    [loginForm, redirectAfterAuth, setStatus, setUser],
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      setRegisterError(null);
      setIsRegisterSubmitting(true);

      try {
        const newUser = await registerUser(data);
        setUser(newUser);
        setStatus("authenticated");
        redirectAfterAuth();
      } catch (error) {
        if (error instanceof AuthError) {
          applyFieldErrors(registerForm, error.fieldErrors);
          setRegisterError(error.message);
        } else {
          setRegisterError("Failed to create account.");
        }
      } finally {
        setIsRegisterSubmitting(false);
      }
    },
    [redirectAfterAuth, registerForm, setStatus, setUser],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      reset();
      router.push("/login");
    }
  }, [reset, router]);

  useEffect(() => {
    if (mode || initStarted.current) return;

    initStarted.current = true;
    void initialize();
  }, [initialize, mode]);

  const base: BaseAuthReturn = {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || status === "idle",
    initialize,
    login,
    register,
    logout,
  };

  if (mode === "login") {
    return {
      ...base,
      form: loginForm,
      onSubmit: loginForm.handleSubmit((data) => login(data)),
      formError: loginError,
      isSubmitting: isLoginSubmitting,
    };
  }

  if (mode === "register") {
    return {
      ...base,
      form: registerForm,
      onSubmit: registerForm.handleSubmit((data) => register(data)),
      formError: registerError,
      isSubmitting: isRegisterSubmitting,
    };
  }

  return base;
}

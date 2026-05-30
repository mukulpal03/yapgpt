"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { LoginForm } from "../../../components/auth/login-form";
import { useAuth } from "../../../hooks/useAuth";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const { form, onSubmit, formError, isSubmitting } = useAuth("login", {
    redirectTo: searchParams.get("redirect"),
  });

  return (
    <LoginForm
      form={form}
      onSubmit={onSubmit}
      formError={formError}
      isSubmitting={isSubmitting}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <LoginPageContent />
    </Suspense>
  );
}

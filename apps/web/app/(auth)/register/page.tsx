"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { RegisterForm } from "../../../components/auth/register-form";
import { useAuth } from "../../../hooks/useAuth";

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const { form, onSubmit, formError, isSubmitting } = useAuth("register", {
    redirectTo: searchParams.get("redirect"),
  });

  return (
    <RegisterForm
      form={form}
      onSubmit={onSubmit}
      formError={formError}
      isSubmitting={isSubmitting}
    />
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <RegisterPageContent />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterInput } from "@repo/validation/auth";

import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";

interface RegisterFormProps {
  form: UseFormReturn<RegisterInput>;
  onSubmit: () => void;
  formError: string | null;
  isSubmitting: boolean;
}

export function RegisterForm({
  form,
  onSubmit,
  formError,
  isSubmitting,
}: RegisterFormProps) {
  return (
    <Card className="w-full max-w-md border-border/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>
          Sign up to start chatting with YapGPT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {formError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

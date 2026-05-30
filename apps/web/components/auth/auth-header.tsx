"use client";

import { LogOut } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";

import { useAuth } from "../../hooks/useAuth";

export function AuthHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
      <div>
        <p className="text-sm font-medium">YapGPT</p>
        {user ? (
          <p className="text-xs text-muted-foreground">{user.email}</p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => void logout()}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </header>
  );
}

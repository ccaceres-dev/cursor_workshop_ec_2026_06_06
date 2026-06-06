"use client";

import { useState } from "react";

import { AuthForm } from "@/components/marketlab/auth-form";
import { Button } from "@/components/ui/button";

export function HeaderAuth() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  function openAuth(nextMode: "sign-in" | "sign-up") {
    setMode(nextMode);
    setOpen(true);
  }

  if (!open) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => openAuth("sign-in")}
        >
          Sign in
        </Button>
        <Button type="button" size="sm" onClick={() => openAuth("sign-up")}>
          Sign up
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg">
      <AuthForm
        initialMode={mode}
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}

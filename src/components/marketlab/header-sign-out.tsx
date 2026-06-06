"use client";

import { useTransition } from "react";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function HeaderSignOut() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await signOut();
        });
      }}
    >
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

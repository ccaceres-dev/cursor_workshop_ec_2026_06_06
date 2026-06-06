import { LogIn, Wallet } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PositionsEmptyState({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
          <LogIn className="size-5" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Sign in to view your positions
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          My Positions shows the fictional markets where you hold fake Yes or No
          shares. Sign in to see your workshop positions.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Use Sign in or Sign up in the header to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
        <Wallet className="size-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        No positions yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        You have not bought any fake shares yet. Browse open markets and buy Yes
        or No shares with your workshop fake balance.
      </p>
      <Button asChild className="mt-6">
        <Link href="/markets">Browse markets</Link>
      </Button>
    </div>
  );
}

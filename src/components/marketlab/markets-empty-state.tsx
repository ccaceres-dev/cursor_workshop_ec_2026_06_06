import Link from "next/link";

import { Button } from "@/components/ui/button";

export function MarketsEmptyState({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Sign in to browse markets
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          MarketLab markets are available to signed-in participants. Once you
          sign in, fictional Yes/No markets will appear here.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Use Sign in or Sign up in the header to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="text-lg font-semibold text-foreground">No markets yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        There are no fictional markets in this project yet. Check back after
        markets are added to the database.
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link href="/markets">Refresh markets</Link>
      </Button>
    </div>
  );
}

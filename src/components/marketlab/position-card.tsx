import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { formatFakeShares } from "@/lib/fake-money";
import { formatCloseDate } from "@/lib/markets/format";
import type { PositionWithMarket } from "@/lib/positions/types";
import { cn } from "@/lib/utils";

export function PositionCard({ position }: { position: PositionWithMarket }) {
  const totalSharesCents = position.yes_shares_cents + position.no_shares_cents;

  return (
    <Link
      href={`/markets/${position.market.id}`}
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all outline-none",
        "hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
          {position.market.title}
        </h2>
        <MarketStatusBadge status={position.market.status} />
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        Closes {formatCloseDate(position.market.close_date)}
      </p>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Yes shares
          </p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {formatFakeShares(position.yes_shares_cents)}
          </p>
        </div>
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2">
          <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
            No shares
          </p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {formatFakeShares(position.no_shares_cents)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="font-medium text-foreground">Total shares</span>
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          {formatFakeShares(totalSharesCents)}
          <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
        </span>
      </div>
    </Link>
  );
}

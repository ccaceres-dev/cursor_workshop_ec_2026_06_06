import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { formatCloseDate } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

export function MarketCard({ market }: { market: Market }) {
  return (
    <Link
      href={`/markets/${market.id}`}
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all outline-none",
        "hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
          {market.title}
        </h2>
        <MarketStatusBadge status={market.status} />
      </div>
      <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
        {market.description}
      </p>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          Closes {formatCloseDate(market.close_date)}
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-brand">
          View market
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

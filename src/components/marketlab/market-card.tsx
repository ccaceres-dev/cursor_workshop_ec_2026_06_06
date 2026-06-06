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
        "group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-colors",
        "hover:border-primary/40 hover:bg-card/80",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground group-hover:text-primary">
          {market.title}
        </h2>
        <MarketStatusBadge status={market.status} />
      </div>
      <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
        {market.description}
      </p>
      <p className="text-xs text-muted-foreground">
        Closes {formatCloseDate(market.close_date)}
      </p>
    </Link>
  );
}

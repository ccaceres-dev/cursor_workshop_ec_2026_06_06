import { formatStatus } from "@/lib/markets/format";
import type { MarketStatus } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<MarketStatus, string> = {
  open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  closed:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  resolved: "border-border bg-muted text-muted-foreground",
};

export function MarketStatusBadge({ status }: { status: string }) {
  const style =
    status in statusStyles
      ? statusStyles[status as MarketStatus]
      : statusStyles.resolved;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        style,
      )}
    >
      {formatStatus(status)}
    </span>
  );
}

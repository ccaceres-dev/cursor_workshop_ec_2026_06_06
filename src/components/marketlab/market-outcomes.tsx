import { formatYesChance } from "@/lib/markets/format";

export function MarketOutcomes({
  yesChancePercent,
}: {
  yesChancePercent: number;
}) {
  const noChancePercent = 100 - yesChancePercent;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Yes
        </p>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          {formatYesChance(yesChancePercent)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Current implied chance
        </p>
      </div>
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
          No
        </p>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          {formatYesChance(noChancePercent)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Current implied chance
        </p>
      </div>
    </div>
  );
}

import { StatTile } from "@/components/marketlab/stat-tile";
import { formatYesChance } from "@/lib/markets/format";

export function MarketOutcomes({
  yesChancePercent,
}: {
  yesChancePercent: number;
}) {
  const noChancePercent = 100 - yesChancePercent;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatTile
        tone="yes"
        label="Yes"
        value={formatYesChance(yesChancePercent)}
        hint="Current implied chance"
      />
      <StatTile
        tone="no"
        label="No"
        value={formatYesChance(noChancePercent)}
        hint="Current implied chance"
      />
    </div>
  );
}

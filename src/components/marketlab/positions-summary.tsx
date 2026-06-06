import { StatTile } from "@/components/marketlab/stat-tile";
import { formatFakeShares } from "@/lib/fake-money";
import type { PositionWithMarket } from "@/lib/positions/types";

export function PositionsSummary({
  positions,
}: {
  positions: PositionWithMarket[];
}) {
  const yesExposure = positions.reduce((sum, p) => sum + p.yes_shares_cents, 0);
  const noExposure = positions.reduce((sum, p) => sum + p.no_shares_cents, 0);
  const totalShares = yesExposure + noExposure;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Markets held" value={positions.length} />
      <StatTile label="Total shares" value={formatFakeShares(totalShares)} />
      <StatTile
        tone="yes"
        label="Yes exposure"
        value={formatFakeShares(yesExposure)}
      />
      <StatTile
        tone="no"
        label="No exposure"
        value={formatFakeShares(noExposure)}
      />
    </div>
  );
}

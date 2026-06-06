import { PageHeader } from "@/components/marketlab/page-header";
import { PositionCard } from "@/components/marketlab/position-card";
import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
import { PositionsSummary } from "@/components/marketlab/positions-summary";
import { getAuthContext } from "@/lib/markets/queries";
import { getUserPositions } from "@/lib/positions/queries";

export default async function PositionsPage() {
  const { isAuthenticated } = await getAuthContext();
  const positions = isAuthenticated ? await getUserPositions() : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <PageHeader
        title="My Positions"
        description="Track your fake Yes and No shares across fictional workshop markets."
      />

      <div className="mt-8">
        {!isAuthenticated || positions.length === 0 ? (
          <PositionsEmptyState isAuthenticated={isAuthenticated} />
        ) : (
          <div className="space-y-6">
            <PositionsSummary positions={positions} />
            <div className="grid gap-4 sm:grid-cols-2">
              {positions.map((position) => (
                <PositionCard key={position.market.id} position={position} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

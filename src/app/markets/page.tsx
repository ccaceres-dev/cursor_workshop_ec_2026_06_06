import { MarketCard } from "@/components/marketlab/market-card";
import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";
import { getAuthContext, getMarkets } from "@/lib/markets/queries";

export default async function MarketsPage() {
  const [{ isAuthenticated }, markets] = await Promise.all([
    getAuthContext(),
    getMarkets(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Markets
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse fictional Yes/No markets using fake money.
        </p>
      </div>

      {markets.length === 0 ? (
        <MarketsEmptyState isAuthenticated={isAuthenticated} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </main>
  );
}

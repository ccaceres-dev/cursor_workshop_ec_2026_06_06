import { FakeMoneyChip } from "@/components/marketlab/fake-money-note";
import { MarketCard } from "@/components/marketlab/market-card";
import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";
import { PageHeader } from "@/components/marketlab/page-header";
import { getAuthContext, getMarkets } from "@/lib/markets/queries";

export default async function MarketsPage() {
  const [{ isAuthenticated }, markets] = await Promise.all([
    getAuthContext(),
    getMarkets(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <PageHeader
        title="Markets"
        description="Browse fictional Yes/No markets using fake money."
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <FakeMoneyChip>
          Spend fake cents to collect Yes or No shares.
        </FakeMoneyChip>
        <FakeMoneyChip>1 fake cent spent = 1 share cent.</FakeMoneyChip>
        <FakeMoneyChip>
          This workshop app does not use real money.
        </FakeMoneyChip>
      </div>

      <div className="mt-8">
        {markets.length === 0 ? (
          <MarketsEmptyState isAuthenticated={isAuthenticated} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

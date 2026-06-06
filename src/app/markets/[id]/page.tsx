import Link from "next/link";
import { notFound } from "next/navigation";

import { BuyPlaceholder } from "@/components/marketlab/buy-placeholder";
import { MarketOutcomes } from "@/components/marketlab/market-outcomes";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { formatCloseDate } from "@/lib/markets/format";
import { getMarketById, getMarketProbability } from "@/lib/markets/queries";

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  const probability = await getMarketProbability(market.id, market.created_at);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/markets"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to markets
      </Link>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {market.title}
            </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {market.description}
            </p>
          </div>
          <MarketStatusBadge status={market.status} />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Closes {formatCloseDate(market.close_date)}
        </p>
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Outcomes</h2>
        <MarketOutcomes yesChancePercent={probability.yesChancePercent} />
      </section>

      <section className="mt-8">
        <ProbabilityChart points={probability.points} mode={probability.mode} />
      </section>

      <section className="mt-8">
        <BuyPlaceholder market={market} />
      </section>
    </main>
  );
}

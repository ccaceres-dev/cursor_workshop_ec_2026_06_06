import { ArrowLeft, CalendarClock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FakeMoneyNote } from "@/components/marketlab/fake-money-note";
import { MarketBuySection } from "@/components/marketlab/market-buy-section";
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <Link
        href="/markets"
        className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" />
        Back to markets
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {market.title}
              </h1>
              <MarketStatusBadge status={market.status} />
            </div>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {market.description}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarClock className="size-4" />
              Closes {formatCloseDate(market.close_date)}
            </div>
            <FakeMoneyNote className="mt-4" />
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Outcomes</h2>
            <MarketOutcomes yesChancePercent={probability.yesChancePercent} />
          </section>

          <section>
            <ProbabilityChart
              points={probability.points}
              mode={probability.mode}
            />
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <MarketBuySection market={market} />
          </div>
        </aside>
      </div>
    </main>
  );
}

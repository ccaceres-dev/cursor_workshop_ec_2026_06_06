import { ArrowLeft, Clock, FileText } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { MarketImage } from "@/components/marketlab/market-image";
import { Button } from "@/components/ui/button";
import { getMarketDetail } from "@/lib/data";
import {
  formatCents,
  formatProbability,
  isMarketClosed,
} from "@/lib/marketlab";

export default async function MarketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMarketDetail(id);

  if (!data.market) {
    return (
      <div className="min-h-svh bg-zinc-50">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-semibold tracking-tight">
            Market not found
          </h1>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/">Back to markets</Link>
          </Button>
        </main>
      </div>
    );
  }

  const market = data.market;
  const status = market.resolvedOutcome
    ? `Resolved ${market.resolvedOutcome.toUpperCase()}`
    : isMarketClosed(market.closeAt)
      ? "Closed"
      : "Open";

  return (
    <div className="min-h-svh bg-zinc-50 text-zinc-950">
      <Header />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_20rem]">
        <section className="min-w-0">
          <Button asChild size="sm" variant="ghost">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Markets
            </Link>
          </Button>

          <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <div className="aspect-[16/7] min-h-56">
              <MarketImage market={market} priority />
            </div>
            <div className="p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                <span className="rounded-md bg-zinc-100 px-2 py-1 text-zinc-700">
                  {market.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  Closes {formatDate(market.closeAt)}
                </span>
                {market.resolvedOutcome ? (
                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-800">
                    Resolved {market.resolvedOutcome.toUpperCase()}
                  </span>
                ) : null}
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight">
                {market.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
                {market.description}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Stat
              label="YES price"
              value={formatProbability(market.stats.yesPrice)}
            />
            <Stat
              label="NO price"
              value={formatProbability(market.stats.noPrice)}
            />
            <Stat
              label="Volume"
              value={formatCents(market.stats.volumeCents)}
            />
          </div>

          <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="size-5 text-zinc-400" />
              <h2 className="text-lg font-semibold tracking-tight">
                Resolution criteria
              </h2>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-zinc-600">
              {market.description}
            </p>
          </section>
        </section>

        <aside className="grid content-start gap-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">Contract</h2>
            <dl className="mt-4 grid gap-4 text-sm">
              <Metric label="Status" value={status} />
              <Metric label="Category" value={market.category} />
              <Metric label="Created" value={formatDate(market.createdAt)} />
              <Metric label="Closes" value={formatDate(market.closeAt)} />
            </dl>
          </section>
        </aside>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-semibold text-zinc-950">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

import { Header } from "@/components/marketlab/header";
import { MarketCard } from "@/components/marketlab/market-card";
import { getHomeData } from "@/lib/data";
import { formatCents } from "@/lib/marketlab";

export default async function Home() {
  const data = await getHomeData();

  return (
    <div className="min-h-svh bg-zinc-50 text-zinc-950">
      <Header />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_20rem]">
        <section className="min-w-0">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
                Demo markets
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Browse workshop outcomes.
              </h1>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-600">
              A compact fake-money prediction market for fictional workshop
              outcomes and local demo scenarios.
            </p>
          </div>

          <div className="grid gap-4">
            {data.markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </section>

        <aside className="grid content-start gap-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">Market mix</h2>
            <dl className="mt-4 grid gap-4 text-sm">
              <Metric label="Markets" value={String(data.markets.length)} />
              <Metric
                label="Total volume"
                value={formatCents(
                  data.markets.reduce(
                    (sum, market) => sum + market.stats.volumeCents,
                    0,
                  ),
                )}
              />
              <Metric
                label="Categories"
                value={String(
                  new Set(data.markets.map((market) => market.category)).size,
                )}
              />
            </dl>
          </section>
        </aside>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-semibold text-zinc-950">{value}</dd>
    </div>
  );
}

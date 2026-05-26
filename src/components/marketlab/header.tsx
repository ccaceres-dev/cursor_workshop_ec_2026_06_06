import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            MarketLab
          </Link>
          <p className="mt-1 text-sm text-zinc-500">
            Fake-money prediction markets for the Cursor workshop.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">
            Static starter
          </span>
        </div>
      </div>
    </header>
  );
}

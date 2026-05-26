import {
  calculateMarketStats,
  type Market,
  type MarketTrade,
} from "@/lib/marketlab";

const now = Date.now();

const demoTrades: Record<string, MarketTrade[]> = {
  "demo-1": [
    {
      amountCents: 2400,
      side: "yes",
    },
    {
      amountCents: 1500,
      side: "no",
    },
  ],
  "demo-2": [
    {
      amountCents: 4200,
      side: "yes",
    },
    {
      amountCents: 1800,
      side: "no",
    },
  ],
  "demo-3": [],
  "demo-4": [
    {
      amountCents: 3100,
      side: "yes",
    },
    {
      amountCents: 2800,
      side: "no",
    },
  ],
};

export const demoMarkets: Market[] = [
  {
    category: "Weather",
    closeAt: daysFromNow(12),
    createdAt: hoursAgo(18),
    description:
      "Resolves YES if a public weather source records measurable rainfall in Quito before midnight local time this Saturday.",
    id: "demo-1",
    imageUrl: null,
    resolvedOutcome: null,
    stats: calculateMarketStats(demoTrades["demo-1"]),
    title: "Will Quito record measurable rain this Saturday?",
  },
  {
    category: "Workshop",
    closeAt: daysFromNow(2),
    createdAt: hoursAgo(9),
    description:
      "Resolves YES if the instructor runs the planned lint, typecheck, unit test, and smoke test commands successfully during the workshop.",
    id: "demo-2",
    imageUrl: null,
    resolvedOutcome: null,
    stats: calculateMarketStats(demoTrades["demo-2"]),
    title: "Will the demo app pass all checks before the workshop ends?",
  },
  {
    category: "Product",
    closeAt: daysFromNow(7),
    createdAt: hoursAgo(3),
    description:
      "Resolves YES if the final live demo includes an uploaded market image served from Supabase Storage.",
    id: "demo-3",
    imageUrl: null,
    resolvedOutcome: null,
    stats: calculateMarketStats(demoTrades["demo-3"]),
    title: "Will the next product demo include a storage upload?",
  },
  {
    category: "Local",
    closeAt: daysFromNow(20),
    createdAt: hoursAgo(5),
    description:
      "Resolves YES if a new public coffee shop listing appears within walking distance of the workshop venue before month end.",
    id: "demo-4",
    imageUrl: null,
    resolvedOutcome: null,
    stats: calculateMarketStats(demoTrades["demo-4"]),
    title: "Will a new local coffee shop open near the venue this month?",
  },
];

function daysFromNow(days: number) {
  return new Date(now + 1000 * 60 * 60 * 24 * days).toISOString();
}

function hoursAgo(hours: number) {
  return new Date(now - 1000 * 60 * 60 * hours).toISOString();
}

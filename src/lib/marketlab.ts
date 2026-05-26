export type MarketSide = "yes" | "no";

export type MarketStats = {
  yesPoolCents: number;
  noPoolCents: number;
  volumeCents: number;
  yesPrice: number;
  noPrice: number;
};

export type MarketTrade = {
  amountCents: number;
  side: MarketSide;
};

export type Market = {
  category: string;
  closeAt: string;
  createdAt: string;
  description: string;
  id: string;
  imageUrl: string | null;
  resolvedOutcome: MarketSide | null;
  stats: MarketStats;
  title: string;
};

export function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(cents / 100);
}

export function formatProbability(price: number) {
  return `${Math.round(price)}%`;
}

export function calculateMarketStats(
  trades: Pick<MarketTrade, "amountCents" | "side">[],
): MarketStats {
  const yesPoolCents = trades
    .filter((trade) => trade.side === "yes")
    .reduce((sum, trade) => sum + trade.amountCents, 0);
  const noPoolCents = trades
    .filter((trade) => trade.side === "no")
    .reduce((sum, trade) => sum + trade.amountCents, 0);
  const volumeCents = yesPoolCents + noPoolCents;

  if (volumeCents === 0) {
    return {
      noPoolCents,
      noPrice: 50,
      volumeCents,
      yesPoolCents,
      yesPrice: 50,
    };
  }

  const yesPrice = clampProbability(
    Math.round((yesPoolCents / volumeCents) * 100),
  );

  return {
    noPoolCents,
    noPrice: 100 - yesPrice,
    volumeCents,
    yesPoolCents,
    yesPrice,
  };
}
export function isMarketClosed(closeAt: string) {
  return new Date(closeAt).getTime() <= Date.now();
}

function clampProbability(value: number) {
  return Math.max(1, Math.min(99, value));
}

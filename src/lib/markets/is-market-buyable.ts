import type { Market } from "@/lib/markets/types";

export function isMarketBuyable(
  market: Pick<Market, "status" | "close_date">,
): boolean {
  if (market.status !== "open") {
    return false;
  }

  return new Date(market.close_date).getTime() > Date.now();
}

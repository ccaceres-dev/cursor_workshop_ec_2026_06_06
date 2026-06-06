import type { Market } from "@/lib/markets/types";

export type MarketPosition = {
  yes_shares_cents: number;
  no_shares_cents: number;
};

export type PositionWithMarket = MarketPosition & {
  market: Pick<Market, "id" | "title" | "status" | "close_date">;
};

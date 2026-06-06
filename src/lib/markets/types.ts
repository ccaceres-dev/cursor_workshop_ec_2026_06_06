import type { Tables } from "@/lib/supabase/database.types";

export type Market = Tables<"markets">;

export type MarketStatus = "open" | "closed" | "resolved";

export type ChartMode = "aggregate" | "ledger" | "baseline_flat";

export type ChartPoint = {
  at: string;
  yesChancePercent: number;
};

export type MarketProbability = {
  yesChancePercent: number;
  points: ChartPoint[];
  mode: ChartMode;
};

export type ChartRange = "7d" | "30d" | "all";

export const NEUTRAL_YES_CHANCE_PERCENT = 50;

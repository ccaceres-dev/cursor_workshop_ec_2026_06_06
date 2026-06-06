import { buildMarketProbability } from "@/lib/markets/probability";
import type { Market, MarketProbability } from "@/lib/markets/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAuthContext(): Promise<{
  isAuthenticated: boolean;
}> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();

    return { isAuthenticated: Boolean(data.user) };
  } catch {
    return { isAuthenticated: false };
  }
}

export async function getMarkets(): Promise<Market[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("markets")
      .select(
        "id, title, description, status, close_date, created_at, updated_at",
      )
      .order("close_date", { ascending: true });

    if (error) {
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getMarketById(id: string): Promise<Market | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("markets")
      .select(
        "id, title, description, status, close_date, created_at, updated_at",
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function getMarketProbability(
  marketId: string,
  marketCreatedAt: string,
): Promise<MarketProbability> {
  try {
    const supabase = await createServerSupabaseClient();
    const [positionsResult, ledgerResult] = await Promise.all([
      supabase
        .from("positions")
        .select("yes_shares_cents, no_shares_cents")
        .eq("market_id", marketId),
      supabase
        .from("ledger_entries")
        .select("amount_cents, created_at, description, entry_type")
        .eq("market_id", marketId)
        .order("created_at", { ascending: true }),
    ]);

    return buildMarketProbability({
      marketCreatedAt,
      positions: positionsResult.data ?? [],
      ledgerRows: ledgerResult.data ?? [],
    });
  } catch {
    return buildMarketProbability({
      marketCreatedAt,
      positions: [],
      ledgerRows: [],
    });
  }
}

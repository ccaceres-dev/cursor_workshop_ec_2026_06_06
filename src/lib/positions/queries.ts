import type { MarketPosition, PositionWithMarket } from "@/lib/positions/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const emptyPosition: MarketPosition = {
  yes_shares_cents: 0,
  no_shares_cents: 0,
};

export async function getUserMarketPosition(
  marketId: string,
): Promise<MarketPosition> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      return emptyPosition;
    }

    const { data, error } = await supabase
      .from("positions")
      .select("yes_shares_cents, no_shares_cents")
      .eq("market_id", marketId)
      .maybeSingle();

    if (error || !data) {
      return emptyPosition;
    }

    return data;
  } catch {
    return emptyPosition;
  }
}

export async function getUserPositions(): Promise<PositionWithMarket[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      return [];
    }

    const { data, error } = await supabase
      .from("positions")
      .select(
        "yes_shares_cents, no_shares_cents, markets!inner(id, title, status, close_date)",
      )
      .order("updated_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.flatMap((row) => {
      const market = Array.isArray(row.markets) ? row.markets[0] : row.markets;

      if (!market) {
        return [];
      }

      return [
        {
          yes_shares_cents: row.yes_shares_cents,
          no_shares_cents: row.no_shares_cents,
          market,
        },
      ];
    });
  } catch {
    return [];
  }
}

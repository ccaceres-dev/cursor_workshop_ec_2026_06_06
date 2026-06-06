"use server";

import { revalidatePath } from "next/cache";

import { isValidBuySide, parseFakeDollarAmount } from "@/lib/fake-money";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type BuyResult = {
  error?: string;
  success?: boolean;
  balanceCents?: number;
  yesSharesCents?: number;
  noSharesCents?: number;
};

function mapRpcError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("not authenticated")) {
    return "Sign in to buy fake shares.";
  }

  if (normalized.includes("insufficient fake balance")) {
    return "You do not have enough fake balance for this purchase.";
  }

  if (
    normalized.includes("not open") ||
    normalized.includes("market not found")
  ) {
    return "This market is not open for buying.";
  }

  if (normalized.includes("invalid side")) {
    return "Choose Yes or No.";
  }

  if (normalized.includes("invalid amount")) {
    return "Enter a valid fake dollar amount.";
  }

  return "Something went wrong. Try again.";
}

export async function buyMarketShares(
  marketId: string,
  side: string,
  amountDollars: string,
): Promise<BuyResult> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "Supabase is not configured. Add your project URL and key to .env.local.",
    };
  }

  if (!isValidBuySide(side)) {
    return { error: "Choose Yes or No." };
  }

  const parsed = parseFakeDollarAmount(amountDollars);

  if (!parsed.ok) {
    return { error: parsed.error };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      return { error: "Sign in to buy fake shares." };
    }

    const { data, error } = await supabase.rpc("buy_market_shares", {
      p_market_id: marketId,
      p_side: side,
      p_amount_cents: parsed.cents,
    });

    if (error) {
      return { error: mapRpcError(error.message) };
    }

    const result = data as {
      balance_cents: number;
      yes_shares_cents: number;
      no_shares_cents: number;
    } | null;

    revalidatePath(`/markets/${marketId}`);
    revalidatePath("/positions");
    revalidatePath("/", "layout");

    return {
      success: true,
      balanceCents: result?.balance_cents,
      yesSharesCents: result?.yes_shares_cents,
      noSharesCents: result?.no_shares_cents,
    };
  } catch {
    return { error: "Something went wrong. Try again." };
  }
}

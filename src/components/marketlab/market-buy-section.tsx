import { Lock } from "lucide-react";

import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";
import { getUserMarketPosition } from "@/lib/positions/queries";
import { getCurrentUserProfile } from "@/lib/profile/queries";

export async function MarketBuySection({ market }: { market: Market }) {
  const [{ user, profile }, position] = await Promise.all([
    getCurrentUserProfile(),
    getUserMarketPosition(market.id),
  ]);
  const buyable = isMarketBuyable(market);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Buy fake shares</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Spend workshop fake money to add Yes or No shares in this fictional
        market.
      </p>

      {!user ? (
        <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
          <div className="flex size-10 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
            <Lock className="size-4" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            Sign in to buy fake shares
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Use Sign in or Sign up in the header to get started.
          </p>
        </div>
      ) : !buyable ? (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-300">
          <Lock className="size-4 shrink-0" />
          This market is closed for buying.
        </div>
      ) : profile ? (
        <div className="mt-6">
          <MarketBuyForm
            marketId={market.id}
            balanceCents={profile.balance_cents}
            position={position}
          />
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Your fake balance is unavailable right now. Try again in a moment.
        </p>
      )}
    </div>
  );
}

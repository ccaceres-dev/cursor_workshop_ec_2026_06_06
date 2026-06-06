import { Button } from "@/components/ui/button";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";

export function BuyPlaceholder({ market }: { market: Market }) {
  const buyable = isMarketBuyable(market);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Trading</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {buyable
          ? "Buying shares will be available in a later workshop step."
          : "This market is closed for trading."}
      </p>
      <Button className="mt-4" disabled>
        Buy shares
      </Button>
    </div>
  );
}

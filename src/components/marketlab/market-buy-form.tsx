"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { buyMarketShares } from "@/app/actions/buy";
import { Button } from "@/components/ui/button";
import {
  type BuySide,
  formatFakeShares,
  parseFakeDollarAmount,
} from "@/lib/fake-money";
import type { MarketPosition } from "@/lib/positions/types";
import { formatFakeBalance } from "@/lib/profile/format";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const sideStyles: Record<BuySide, string> = {
  yes: "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  no: "border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

type MarketBuyFormProps = {
  marketId: string;
  balanceCents: number;
  position: MarketPosition;
};

export function MarketBuyForm({
  marketId,
  balanceCents,
  position,
}: MarketBuyFormProps) {
  const router = useRouter();
  const [side, setSide] = useState<BuySide>("yes");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const parsed = useMemo(
    () => (amount.trim() ? parseFakeDollarAmount(amount) : null),
    [amount],
  );
  const previewCents = parsed?.ok ? parsed.cents : null;
  const exceedsBalance = previewCents !== null && previewCents > balanceCents;
  const inlineHint =
    parsed && !parsed.ok
      ? parsed.error
      : exceedsBalance
        ? "Amount exceeds your fake balance."
        : null;
  const canSubmit = !pending && previewCents !== null && !exceedsBalance;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);

    try {
      const result = await buyMarketShares(marketId, side, amount);

      if (result.error) {
        setError(result.error);
        return;
      }

      setAmount("");
      setSuccess(
        "Purchase complete. Your fake balance and position are updated.",
      );
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Available fake balance</span>
          <span className="font-semibold text-foreground">
            {formatFakeBalance(balanceCents)}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Your position</span>
          <span className="font-medium text-foreground">
            Yes {formatFakeShares(position.yes_shares_cents)}, No{" "}
            {formatFakeShares(position.no_shares_cents)}
          </span>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Side</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["yes", "no"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={side === value}
              disabled={pending}
              onClick={() => setSide(value)}
              className={cn(
                "rounded-lg border-2 px-3 py-2.5 text-sm font-semibold capitalize transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
                side === value
                  ? sideStyles[value]
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label
          htmlFor="buy-amount"
          className="text-sm font-medium text-foreground"
        >
          Fake dollars to spend
        </label>
        <input
          id="buy-amount"
          name="amount"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="10.00"
          value={amount}
          disabled={pending}
          aria-invalid={inlineHint ? true : undefined}
          aria-describedby="buy-amount-hint"
          onChange={(event) => setAmount(event.target.value)}
          className={inputClassName}
        />
        <p id="buy-amount-hint" className="text-xs text-muted-foreground">
          1 fake cent spent equals 1 share cent. Use up to two decimal places.
        </p>
      </div>

      <div
        className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Spending</span>
          <span className="font-medium text-foreground">
            {previewCents !== null ? formatFakeShares(previewCents) : "—"}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <span className="text-muted-foreground">
            {side === "yes" ? "Yes" : "No"} share cents to collect
          </span>
          <span
            className={cn(
              "font-semibold",
              previewCents === null
                ? "text-muted-foreground"
                : side === "yes"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-rose-700 dark:text-rose-300",
            )}
          >
            {previewCents !== null ? formatFakeShares(previewCents) : "—"}
          </span>
        </div>
        {inlineHint ? (
          <p className="mt-2 text-xs text-destructive">{inlineHint}</p>
        ) : null}
      </div>

      {error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
          role="status"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {success}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        className="w-full capitalize"
      >
        {pending ? "Buying..." : `Buy ${side} shares`}
      </Button>
    </form>
  );
}

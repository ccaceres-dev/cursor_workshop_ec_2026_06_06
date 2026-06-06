import {
  formatFakeBalance,
  formatFakeBalanceDetail,
} from "@/lib/profile/format";
import type { Profile } from "@/lib/profile/queries";

export function HeaderBalance({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <span
        className="hidden rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground sm:inline-flex"
        title="Profile is still being created"
      >
        Balance unavailable
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-sm font-medium text-foreground"
      title={formatFakeBalanceDetail(profile.balance_cents)}
    >
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
      {formatFakeBalance(profile.balance_cents)}
    </span>
  );
}

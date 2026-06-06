import {
  formatFakeBalance,
  formatFakeBalanceDetail,
} from "@/lib/profile/format";
import type { Profile } from "@/lib/profile/queries";

export function HeaderBalance({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <span
        className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground"
        title="Profile is still being created"
      >
        Balance unavailable
      </span>
    );
  }

  return (
    <span
      className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground"
      title={formatFakeBalanceDetail(profile.balance_cents)}
    >
      {formatFakeBalance(profile.balance_cents)}
    </span>
  );
}

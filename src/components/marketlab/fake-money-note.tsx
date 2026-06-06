import { cn } from "@/lib/utils";

export function FakeMoneyChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs font-medium text-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
      {children}
    </span>
  );
}

export function FakeMoneyNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground",
        className,
      )}
    >
      This workshop app does not use real money.
    </p>
  );
}

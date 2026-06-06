import { cn } from "@/lib/utils";

type StatTone = "neutral" | "yes" | "no";

const toneStyles: Record<StatTone, { surface: string; label: string }> = {
  neutral: {
    surface: "border-border bg-muted/40",
    label: "text-muted-foreground",
  },
  yes: {
    surface: "border-emerald-500/30 bg-emerald-500/10",
    label: "text-emerald-700 dark:text-emerald-300",
  },
  no: {
    surface: "border-rose-500/30 bg-rose-500/10",
    label: "text-rose-700 dark:text-rose-300",
  },
};

export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: StatTone;
  className?: string;
}) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn("rounded-xl border p-4 sm:p-5", styles.surface, className)}
    >
      <p className={cn("text-sm font-medium", styles.label)}>{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

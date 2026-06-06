import type { MarketStatus } from "@/lib/markets/types";

const statusLabels: Record<MarketStatus, string> = {
  open: "Open",
  closed: "Closed",
  resolved: "Resolved",
};

export function formatStatus(status: string): string {
  if (status in statusLabels) {
    return statusLabels[status as MarketStatus];
  }

  return status;
}

export function formatCloseDate(closeDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(closeDate));
}

export function formatYesChance(percent: number): string {
  return `${Math.round(percent)}%`;
}

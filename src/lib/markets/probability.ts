import type {
  ChartPoint,
  ChartRange,
  MarketProbability,
} from "@/lib/markets/types";
import { NEUTRAL_YES_CHANCE_PERCENT } from "@/lib/markets/types";

type PositionRow = {
  yes_shares_cents: number;
  no_shares_cents: number;
};

type LedgerRow = {
  amount_cents: number;
  created_at: string;
  description: string | null;
  entry_type: string;
};

export function computeYesChanceFromTotals(
  yesTotal: number,
  noTotal: number,
): number | null {
  const total = yesTotal + noTotal;

  if (total <= 0) {
    return null;
  }

  return (yesTotal / total) * 100;
}

export function isMarketWideAggregateAvailable(positionCount: number): boolean {
  return positionCount > 1;
}

export function inferLedgerSide(
  entryType: string,
  description: string | null,
): "yes" | "no" | null {
  const normalizedType = entryType.toLowerCase();
  const haystack = `${entryType} ${description ?? ""}`.toLowerCase();

  if (/_yes\b/.test(normalizedType) || /\byes\b/.test(haystack)) {
    return "yes";
  }

  if (/_no\b/.test(normalizedType) || /\bno\b/.test(haystack)) {
    return "no";
  }

  return null;
}

export function buildLedgerChartPoints(
  ledgerRows: LedgerRow[],
  marketCreatedAt: string,
  nowIso = new Date().toISOString(),
): ChartPoint[] | null {
  const tradeRows = ledgerRows
    .filter((row) => inferLedgerSide(row.entry_type, row.description) !== null)
    .sort(
      (left, right) =>
        new Date(left.created_at).getTime() -
        new Date(right.created_at).getTime(),
    );

  if (tradeRows.length === 0) {
    return null;
  }

  let yesTotal = 0;
  let noTotal = 0;
  const points: ChartPoint[] = [
    {
      at: marketCreatedAt,
      yesChancePercent: NEUTRAL_YES_CHANCE_PERCENT,
    },
  ];

  for (const row of tradeRows) {
    const side = inferLedgerSide(row.entry_type, row.description);

    if (side === "yes") {
      yesTotal += Math.abs(row.amount_cents);
    }

    if (side === "no") {
      noTotal += Math.abs(row.amount_cents);
    }

    const yesChancePercent =
      computeYesChanceFromTotals(yesTotal, noTotal) ??
      NEUTRAL_YES_CHANCE_PERCENT;

    points.push({
      at: row.created_at,
      yesChancePercent,
    });
  }

  const lastPoint = points.at(-1);

  if (!lastPoint || lastPoint.at !== nowIso) {
    points.push({
      at: nowIso,
      yesChancePercent:
        lastPoint?.yesChancePercent ?? NEUTRAL_YES_CHANCE_PERCENT,
    });
  }

  return points;
}

export function buildFlatChartSeries(
  marketCreatedAt: string,
  yesChancePercent: number,
  nowIso = new Date().toISOString(),
): ChartPoint[] {
  return [
    { at: marketCreatedAt, yesChancePercent },
    { at: nowIso, yesChancePercent },
  ];
}

export function filterChartPointsByRange(
  points: ChartPoint[],
  range: ChartRange,
  now = Date.now(),
): ChartPoint[] {
  if (range === "all" || points.length === 0) {
    return points;
  }

  const rangeMs =
    range === "7d" ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const cutoff = now - rangeMs;
  const filtered = points.filter(
    (point) => new Date(point.at).getTime() >= cutoff,
  );

  if (filtered.length === 0) {
    return points.slice(-2);
  }

  return filtered;
}

export function buildMarketProbability(input: {
  marketCreatedAt: string;
  positions: PositionRow[];
  ledgerRows: LedgerRow[];
  nowIso?: string;
}): MarketProbability {
  const nowIso = input.nowIso ?? new Date().toISOString();
  const yesTotal = input.positions.reduce(
    (sum, position) => sum + position.yes_shares_cents,
    0,
  );
  const noTotal = input.positions.reduce(
    (sum, position) => sum + position.no_shares_cents,
    0,
  );

  if (isMarketWideAggregateAvailable(input.positions.length)) {
    const yesChancePercent =
      computeYesChanceFromTotals(yesTotal, noTotal) ??
      NEUTRAL_YES_CHANCE_PERCENT;

    const ledgerPoints = buildLedgerChartPoints(
      input.ledgerRows,
      input.marketCreatedAt,
      nowIso,
    );

    if (ledgerPoints) {
      return {
        yesChancePercent:
          ledgerPoints.at(-1)?.yesChancePercent ?? yesChancePercent,
        points: ledgerPoints,
        mode: "ledger",
      };
    }

    return {
      yesChancePercent,
      points: buildFlatChartSeries(
        input.marketCreatedAt,
        yesChancePercent,
        nowIso,
      ),
      mode: "aggregate",
    };
  }

  const ledgerPoints = buildLedgerChartPoints(
    input.ledgerRows,
    input.marketCreatedAt,
    nowIso,
  );

  if (ledgerPoints) {
    return {
      yesChancePercent:
        ledgerPoints.at(-1)?.yesChancePercent ?? NEUTRAL_YES_CHANCE_PERCENT,
      points: ledgerPoints,
      mode: "ledger",
    };
  }

  return {
    yesChancePercent: NEUTRAL_YES_CHANCE_PERCENT,
    points: buildFlatChartSeries(
      input.marketCreatedAt,
      NEUTRAL_YES_CHANCE_PERCENT,
      nowIso,
    ),
    mode: "baseline_flat",
  };
}

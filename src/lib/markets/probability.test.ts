import { describe, expect, it } from "vitest";

import {
  buildFlatChartSeries,
  buildLedgerChartPoints,
  buildMarketProbability,
  computeYesChanceFromTotals,
  inferLedgerSide,
} from "@/lib/markets/probability";
import { NEUTRAL_YES_CHANCE_PERCENT } from "@/lib/markets/types";

const marketCreatedAt = "2026-01-01T00:00:00.000Z";
const nowIso = "2026-06-01T00:00:00.000Z";

describe("computeYesChanceFromTotals", () => {
  it("returns 50% when totals are empty", () => {
    expect(computeYesChanceFromTotals(0, 0)).toBeNull();
  });

  it("computes yes share from totals", () => {
    expect(computeYesChanceFromTotals(75, 25)).toBe(75);
  });
});

describe("inferLedgerSide", () => {
  it("detects yes and no hints from ledger metadata", () => {
    expect(inferLedgerSide("trade", "Bought yes shares")).toBe("yes");
    expect(inferLedgerSide("trade_no", null)).toBe("no");
    expect(inferLedgerSide("signup_bonus", "Welcome")).toBeNull();
  });
});

describe("buildLedgerChartPoints", () => {
  it("returns null when no reconstructable ledger rows exist", () => {
    expect(
      buildLedgerChartPoints(
        [
          {
            amount_cents: 100,
            created_at: "2026-02-01T00:00:00.000Z",
            description: "Signup bonus",
            entry_type: "signup_bonus",
          },
        ],
        marketCreatedAt,
        nowIso,
      ),
    ).toBeNull();
  });

  it("builds a ledger-derived series", () => {
    const points = buildLedgerChartPoints(
      [
        {
          amount_cents: 100,
          created_at: "2026-02-01T00:00:00.000Z",
          description: "Bought yes shares",
          entry_type: "trade",
        },
        {
          amount_cents: 100,
          created_at: "2026-03-01T00:00:00.000Z",
          description: "Bought no shares",
          entry_type: "trade",
        },
      ],
      marketCreatedAt,
      nowIso,
    );

    expect(points).not.toBeNull();
    expect(points?.at(-1)?.yesChancePercent).toBe(50);
  });
});

describe("buildFlatChartSeries", () => {
  it("returns a flat baseline line", () => {
    const points = buildFlatChartSeries(marketCreatedAt, 50, nowIso);

    expect(points).toHaveLength(2);
    expect(points[0].yesChancePercent).toBe(50);
    expect(points[1].yesChancePercent).toBe(50);
  });
});

describe("buildMarketProbability", () => {
  it("uses a 50% flat baseline when aggregates and ledger history are unavailable", () => {
    const result = buildMarketProbability({
      marketCreatedAt,
      positions: [],
      ledgerRows: [],
      nowIso,
    });

    expect(result.mode).toBe("baseline_flat");
    expect(result.yesChancePercent).toBe(NEUTRAL_YES_CHANCE_PERCENT);
    expect(result.points).toHaveLength(2);
    expect(result.points.every((point) => point.yesChancePercent === 50)).toBe(
      true,
    );
  });

  it("uses ledger mode when only user-visible ledger rows are available", () => {
    const result = buildMarketProbability({
      marketCreatedAt,
      positions: [
        {
          yes_shares_cents: 100,
          no_shares_cents: 0,
        },
      ],
      ledgerRows: [
        {
          amount_cents: 100,
          created_at: "2026-02-01T00:00:00.000Z",
          description: "Bought yes shares",
          entry_type: "trade",
        },
      ],
      nowIso,
    });

    expect(result.mode).toBe("ledger");
    expect(result.yesChancePercent).toBe(100);
  });
});

import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "@/lib/markets/is-market-buyable";

const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

describe("isMarketBuyable", () => {
  it("returns true for open markets with a future close date", () => {
    expect(
      isMarketBuyable({
        status: "open",
        close_date: futureDate,
      }),
    ).toBe(true);
  });

  it("returns false for closed markets", () => {
    expect(
      isMarketBuyable({
        status: "closed",
        close_date: futureDate,
      }),
    ).toBe(false);
  });

  it("returns false for resolved markets", () => {
    expect(
      isMarketBuyable({
        status: "resolved",
        close_date: futureDate,
      }),
    ).toBe(false);
  });

  it("returns false when the close date has passed", () => {
    expect(
      isMarketBuyable({
        status: "open",
        close_date: pastDate,
      }),
    ).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import {
  formatFakeBalance,
  formatFakeBalanceDetail,
} from "@/lib/profile/format";

describe("formatFakeBalance", () => {
  it("formats cents as fake dollars", () => {
    expect(formatFakeBalance(1000)).toBe("$10.00 fake");
    expect(formatFakeBalance(100_000)).toBe("$1000.00 fake");
  });

  it("includes cents detail", () => {
    expect(formatFakeBalanceDetail(10_000)).toBe(
      "10,000 fake cents ($100.00 fake)",
    );
  });
});

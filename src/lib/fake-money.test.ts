import { describe, expect, it } from "vitest";

import {
  formatFakeShares,
  isValidBuySide,
  parseFakeDollarAmount,
} from "@/lib/fake-money";

describe("parseFakeDollarAmount", () => {
  it("parses whole and decimal dollar amounts", () => {
    expect(parseFakeDollarAmount("1")).toEqual({ ok: true, cents: 100 });
    expect(parseFakeDollarAmount("1.50")).toEqual({ ok: true, cents: 150 });
    expect(parseFakeDollarAmount("10.00")).toEqual({ ok: true, cents: 1000 });
  });

  it("rejects empty and invalid amounts", () => {
    expect(parseFakeDollarAmount("")).toEqual({
      ok: false,
      error: "Enter a fake dollar amount.",
    });
    expect(parseFakeDollarAmount("abc")).toEqual({
      ok: false,
      error: "Use a valid amount with up to two decimal places.",
    });
    expect(parseFakeDollarAmount("1.999")).toEqual({
      ok: false,
      error: "Use a valid amount with up to two decimal places.",
    });
    expect(parseFakeDollarAmount(".50")).toEqual({
      ok: false,
      error: "Use a valid amount with up to two decimal places.",
    });
  });

  it("rejects zero amounts", () => {
    expect(parseFakeDollarAmount("0")).toEqual({
      ok: false,
      error: "Amount must be greater than zero.",
    });
    expect(parseFakeDollarAmount("0.00")).toEqual({
      ok: false,
      error: "Amount must be greater than zero.",
    });
  });
});

describe("formatFakeShares", () => {
  it("formats cents as fake dollars", () => {
    expect(formatFakeShares(150)).toBe("$1.50 fake");
    expect(formatFakeShares(1000)).toBe("$10.00 fake");
  });
});

describe("isValidBuySide", () => {
  it("accepts yes and no only", () => {
    expect(isValidBuySide("yes")).toBe(true);
    expect(isValidBuySide("no")).toBe(true);
    expect(isValidBuySide("maybe")).toBe(false);
    expect(isValidBuySide("")).toBe(false);
  });
});

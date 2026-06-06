export type BuySide = "yes" | "no";

export type ParseFakeDollarResult =
  | { ok: true; cents: number }
  | { ok: false; error: string };

const DOLLAR_AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export function isValidBuySide(side: string): side is BuySide {
  return side === "yes" || side === "no";
}

export function parseFakeDollarAmount(input: string): ParseFakeDollarResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: "Enter a fake dollar amount." };
  }

  if (!DOLLAR_AMOUNT_PATTERN.test(trimmed)) {
    return {
      ok: false,
      error: "Use a valid amount with up to two decimal places.",
    };
  }

  const [wholePart, fractionPart = ""] = trimmed.split(".");
  const whole = Number.parseInt(wholePart, 10);
  const fraction = fractionPart.padEnd(2, "0");
  const cents = whole * 100 + Number.parseInt(fraction, 10);

  if (cents <= 0) {
    return { ok: false, error: "Amount must be greater than zero." };
  }

  return { ok: true, cents };
}

export function formatFakeShares(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)} fake`;
}

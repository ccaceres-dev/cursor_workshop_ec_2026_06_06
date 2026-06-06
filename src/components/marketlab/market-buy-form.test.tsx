import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { MarketBuyForm } from "@/components/marketlab/market-buy-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock("@/app/actions/buy", () => ({
  buyMarketShares: vi.fn(),
}));

describe("MarketBuyForm", () => {
  it("renders balance, position, and buy controls", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        balanceCents={10_000}
        position={{ yes_shares_cents: 500, no_shares_cents: 250 }}
      />,
    );

    expect(html).toContain("$100.00 fake");
    expect(html).toContain("$5.00 fake");
    expect(html).toContain("$2.50 fake");
    expect(html).toContain("Buy yes shares");
    expect(html).toContain("Fake dollars to spend");
  });
});

describe("MarketBuyForm import boundary", () => {
  it("does not import server-only modules", () => {
    const formSource = readFileSync(
      join(process.cwd(), "src/components/marketlab/market-buy-form.tsx"),
      "utf8",
    );

    expect(formSource).not.toContain("next/headers");
    expect(formSource).not.toContain("cookies()");
    expect(formSource).not.toContain("@/lib/supabase/server");
    expect(formSource).toContain("buyMarketShares");
  });
});

describe("MarketBuySection", () => {
  it("handles signed-out and closed market states in source", () => {
    const sectionSource = readFileSync(
      join(process.cwd(), "src/components/marketlab/market-buy-section.tsx"),
      "utf8",
    );

    expect(sectionSource).toContain("Sign in to buy fake shares");
    expect(sectionSource).toContain("closed for buying");
    expect(sectionSource).toContain("MarketBuyForm");
  });
});

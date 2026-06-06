import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PositionCard } from "@/components/marketlab/position-card";

describe("PositionCard", () => {
  it("shows yes, no, total shares and links to the market", () => {
    const html = renderToStaticMarkup(
      <PositionCard
        position={{
          yes_shares_cents: 1000,
          no_shares_cents: 500,
          market: {
            id: "market-1",
            title: "Will it rain tomorrow?",
            status: "open",
            close_date: "2026-12-31T23:59:59.000Z",
          },
        }}
      />,
    );

    expect(html).toContain('href="/markets/market-1"');
    expect(html).toContain("Will it rain tomorrow?");
    expect(html).toContain("$10.00 fake");
    expect(html).toContain("$5.00 fake");
    expect(html).toContain("Total shares");
    expect(html).toContain("$15.00 fake");
  });
});

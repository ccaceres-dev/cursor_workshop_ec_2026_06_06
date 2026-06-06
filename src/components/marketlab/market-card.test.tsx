import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarketCard } from "@/components/marketlab/market-card";

const market = {
  id: "market-1",
  title: "Will it rain in Quito tomorrow?",
  description: "A fictional weather market for the workshop.",
  status: "open",
  close_date: "2026-12-31T23:59:59.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("MarketCard", () => {
  it("renders title, status, and close date", () => {
    const html = renderToStaticMarkup(<MarketCard market={market} />);

    expect(html).toContain("Will it rain in Quito tomorrow?");
    expect(html).toContain("Open");
    expect(html).toContain("Closes");
  });
});

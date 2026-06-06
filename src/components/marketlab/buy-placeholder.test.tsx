import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BuyPlaceholder } from "@/components/marketlab/buy-placeholder";

const baseMarket = {
  id: "market-1",
  title: "Test market",
  description: "Description",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("BuyPlaceholder", () => {
  it("shows unavailable copy for closed markets", () => {
    const html = renderToStaticMarkup(
      <BuyPlaceholder
        market={{
          ...baseMarket,
          status: "closed",
          close_date: "2026-12-31T23:59:59.000Z",
        }}
      />,
    );

    expect(html).toContain("closed for trading");
    expect(html).toContain("disabled");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HeaderBalance } from "@/components/marketlab/header-balance";

describe("HeaderBalance", () => {
  it("renders fake balance for a profile", () => {
    const html = renderToStaticMarkup(
      <HeaderBalance
        profile={{
          id: "user-1",
          first_name: "Ada",
          last_name: "Lovelace",
          balance_cents: 10_000,
        }}
      />,
    );

    expect(html).toContain("$100.00 fake");
    expect(html).toContain("10,000 fake cents");
  });

  it("handles missing profile state", () => {
    const html = renderToStaticMarkup(<HeaderBalance profile={null} />);

    expect(html).toContain("Balance unavailable");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";

describe("MarketsEmptyState", () => {
  it("renders signed-out messaging", () => {
    const html = renderToStaticMarkup(
      <MarketsEmptyState isAuthenticated={false} />,
    );

    expect(html).toContain("Sign in to browse markets");
  });

  it("renders empty catalog messaging for signed-in users", () => {
    const html = renderToStaticMarkup(<MarketsEmptyState isAuthenticated />);

    expect(html).toContain("No markets yet");
  });
});

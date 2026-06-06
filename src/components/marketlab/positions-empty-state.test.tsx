import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";

describe("PositionsEmptyState", () => {
  it("shows a sign-in message when signed out", () => {
    const html = renderToStaticMarkup(
      <PositionsEmptyState isAuthenticated={false} />,
    );

    expect(html).toContain("Sign in to view your positions");
    expect(html).not.toContain("Browse markets");
  });

  it("shows an empty positions message when signed in", () => {
    const html = renderToStaticMarkup(
      <PositionsEmptyState isAuthenticated={true} />,
    );

    expect(html).toContain("No positions yet");
    expect(html).toContain("Browse markets");
  });
});

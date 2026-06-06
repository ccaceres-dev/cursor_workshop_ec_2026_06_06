import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProbabilityChart } from "@/components/marketlab/probability-chart";

describe("ProbabilityChart", () => {
  it("renders an SVG path for the probability line", () => {
    const html = renderToStaticMarkup(
      <ProbabilityChart
        mode="baseline_flat"
        points={[
          { at: "2026-01-01T00:00:00.000Z", yesChancePercent: 50 },
          { at: "2026-06-01T00:00:00.000Z", yesChancePercent: 50 },
        ]}
      />,
    );

    expect(html).toContain("<svg");
    expect(html).toContain('d="M');
    expect(html).toContain("flat 50% baseline");
  });
});

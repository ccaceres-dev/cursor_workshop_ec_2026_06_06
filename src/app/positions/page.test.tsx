import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("PositionsPage", () => {
  it("loads positions from authenticated server context", () => {
    const pageSource = readFileSync(
      join(process.cwd(), "src/app/positions/page.tsx"),
      "utf8",
    );

    expect(pageSource).toContain("getUserPositions");
    expect(pageSource).toContain("getAuthContext");
    expect(pageSource).toContain("PositionsEmptyState");
    expect(pageSource).toContain("PositionCard");
  });
});

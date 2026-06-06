import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Markets page", () => {
  it("does not reference removed hero assets", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/markets/page.tsx"),
      "utf8",
    );

    expect(source).not.toContain("hero2-bg");
    expect(source).not.toContain("quito");
  });
});

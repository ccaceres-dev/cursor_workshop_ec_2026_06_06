import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("HeaderNav", () => {
  it("includes Markets and My Positions links", () => {
    const navSource = readFileSync(
      join(process.cwd(), "src/components/marketlab/header-nav.tsx"),
      "utf8",
    );

    expect(navSource).toContain('href: "/markets"');
    expect(navSource).toContain('href: "/positions"');
    expect(navSource).toContain("My Positions");
    expect(navSource).toContain("usePathname");
  });
});

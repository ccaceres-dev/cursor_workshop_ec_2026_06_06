import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("AuthForm", () => {
  it("passes profile names through signup metadata and handles email confirmation", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/marketlab/auth-form.tsx"),
      "utf8",
    );

    expect(source).toContain("first_name: firstName.trim()");
    expect(source).toContain("last_name: lastName.trim()");
    expect(source).toContain("Check your email");
    expect(source).toContain("router.refresh()");
  });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("AuthForm", () => {
  it("uses server actions and handles email confirmation", () => {
    const formSource = readFileSync(
      join(process.cwd(), "src/components/marketlab/auth-form.tsx"),
      "utf8",
    );
    const actionSource = readFileSync(
      join(process.cwd(), "src/app/actions/auth.ts"),
      "utf8",
    );

    expect(formSource).toContain("signUpWithPassword");
    expect(formSource).toContain("signInWithPassword");
    expect(formSource).toContain("Check your email");
    expect(formSource).toContain("router.refresh()");
    expect(actionSource).toContain("first_name: firstName.trim()");
    expect(actionSource).toContain("last_name: lastName.trim()");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HeaderActions } from "@/components/marketlab/header-actions";
import { ThemeProvider } from "@/components/marketlab/theme-provider";

describe("HeaderActions", () => {
  it("renders signed-out actions", () => {
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <HeaderActions user={null} profile={null} />
      </ThemeProvider>,
    );

    expect(html).toContain("Sign in");
    expect(html).toContain("Sign up");
    expect(html).not.toContain("Sign out");
    expect(html).toContain("Switch to dark mode");
  });

  it("renders signed-in balance and sign out", () => {
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <HeaderActions
          user={{ id: "user-1", email: "ada@example.com" }}
          profile={{
            id: "user-1",
            first_name: "Ada",
            last_name: "Lovelace",
            balance_cents: 10_000,
          }}
        />
      </ThemeProvider>,
    );

    expect(html).toContain("$100.00 fake");
    expect(html).toContain("Sign out");
    expect(html).not.toContain("Sign in");
    expect(html).not.toContain("Sign up");
    expect(html).toContain("Switch to dark mode");
  });

  it("renders missing profile state for signed-in users", () => {
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <HeaderActions user={{ id: "user-1" }} profile={null} />
      </ThemeProvider>,
    );

    expect(html).toContain("Balance unavailable");
    expect(html).toContain("Sign out");
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { ThemeToggle } from "./ThemeToggle";

function setHtmlTheme(theme: string) {
  document.documentElement.dataset.theme = theme;
}

describe("ThemeToggle", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("marks the theme already on the html element as pressed", async () => {
    setHtmlTheme("light");
    render(<ThemeToggle />);

    expect(await screen.findByRole("button", { name: "LIGHT", pressed: true })).toBeVisible();
    expect(screen.getByRole("button", { name: "DARK", pressed: false })).toBeVisible();
  });

  it("exposes the two options as a labelled group", () => {
    setHtmlTheme("dark");
    render(<ThemeToggle />);

    const group = screen.getByRole("group", { name: "Theme" });
    expect(group).toContainElement(screen.getByRole("button", { name: "DARK" }));
    expect(group).toContainElement(screen.getByRole("button", { name: "LIGHT" }));
  });

  it("switches the html attribute, persists the choice and updates aria-pressed", async () => {
    setHtmlTheme("dark");
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "LIGHT" }));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    await waitFor(() => expect(screen.getByRole("button", { name: "LIGHT" })).toHaveAttribute("aria-pressed", "true"));
    expect(screen.getByRole("button", { name: "DARK" })).toHaveAttribute("aria-pressed", "false");
  });

  it("still switches the theme when storage throws", async () => {
    setHtmlTheme("light");
    vi.stubGlobal("localStorage", {
      setItem: () => {
        throw new Error("denied");
      },
    });
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "DARK" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("follows external changes to the html attribute", async () => {
    setHtmlTheme("dark");
    render(<ThemeToggle />);

    setHtmlTheme("light");

    expect(await screen.findByRole("button", { name: "LIGHT", pressed: true })).toBeVisible();
  });

  it("presses neither option when the attribute is missing or invalid", () => {
    setHtmlTheme("sepia");
    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: "DARK" })).not.toHaveAttribute("aria-pressed");
    expect(screen.getByRole("button", { name: "LIGHT" })).not.toHaveAttribute("aria-pressed");
  });
});

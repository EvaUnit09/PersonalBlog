import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY, THEMES, parseTheme, themeInitScript } from "./theme";

function runScript() {
  new Function(themeInitScript())();
  return document.documentElement.dataset.theme;
}

function stubSystemScheme(isLight: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: isLight && query === "(prefers-color-scheme: light)",
  }));
}

function stubThrowingStorage() {
  vi.stubGlobal("localStorage", {
    getItem: () => {
      throw new Error("denied");
    },
  });
}

describe("parseTheme", () => {
  it("accepts exactly the known themes", () => {
    expect(THEMES.map(parseTheme)).toEqual(["dark", "light"]);
  });

  it.each([null, undefined, "", "Dark", "auto", 1, {}])("rejects %s", (value) => {
    expect(parseTheme(value)).toBeNull();
  });
});

describe("themeInitScript", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("prefers the stored theme over the system scheme", () => {
    stubSystemScheme(true);
    localStorage.setItem(THEME_STORAGE_KEY, "dark");

    expect(runScript()).toBe("dark");
  });

  it("follows a light system scheme when nothing is stored", () => {
    stubSystemScheme(true);

    expect(runScript()).toBe("light");
  });

  it("defaults to dark when the system has no light preference", () => {
    stubSystemScheme(false);

    expect(runScript()).toBe("dark");
  });

  it("ignores an invalid stored value", () => {
    stubSystemScheme(true);
    localStorage.setItem(THEME_STORAGE_KEY, "sepia");

    expect(runScript()).toBe("light");
  });

  it("falls back to the system scheme when storage throws", () => {
    stubSystemScheme(true);
    stubThrowingStorage();

    expect(runScript()).toBe("light");
  });

  it("falls back to dark when both storage and matchMedia are unavailable", () => {
    stubThrowingStorage();
    vi.stubGlobal("matchMedia", undefined);

    expect(runScript()).toBe("dark");
  });
});

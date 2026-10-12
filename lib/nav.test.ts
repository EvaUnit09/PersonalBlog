import { describe, expect, it } from "vitest";
import { isNavItemActive } from "./nav";

describe("isNavItemActive", () => {
  it("matches the exact route", () => {
    expect(isNavItemActive("/about", "/about")).toBe(true);
  });

  it("matches child routes of a section", () => {
    expect(isNavItemActive("/projects/nightcap", "/projects")).toBe(true);
    expect(isNavItemActive("/log/django-settings", "/log")).toBe(true);
  });

  it("does not match a route that merely shares a prefix", () => {
    expect(isNavItemActive("/logbook", "/log")).toBe(false);
  });

  it("never marks the in-page Experience anchor as a current page", () => {
    expect(isNavItemActive("/", "/#experience")).toBe(false);
  });
});

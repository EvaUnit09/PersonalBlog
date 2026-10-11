import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

const pathname = vi.hoisted(() => ({ current: "/projects/nightcap" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

describe("SiteHeader", () => {
  it("links the wordmark home", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Noah Decaille" })).toHaveAttribute("href", "/");
  });

  it("renders the four numbered sections in the primary nav", () => {
    render(<SiteHeader />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/about",
      "/projects",
      "/#experience",
      "/log",
    ]);
    expect(links[0]).toHaveTextContent("01 / About");
  });

  it("marks the current section with aria-current", () => {
    render(<SiteHeader />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).getByRole("link", { name: /Projects/ })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: /About/ })).not.toHaveAttribute("aria-current");
  });
});

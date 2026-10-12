import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "./Panel";

describe("Panel", () => {
  it("renders a section by default with its children", () => {
    render(<Panel aria-label="Status">content</Panel>);

    const panel = screen.getByRole("region", { name: "Status" });
    expect(panel.tagName).toBe("SECTION");
    expect(panel).toHaveTextContent("content");
  });

  it("renders the requested element", () => {
    render(<Panel as="aside" aria-label="Stack">x</Panel>);

    expect(screen.getByRole("complementary", { name: "Stack" })).toBeInTheDocument();
  });

  it("draws four decorative corner brackets hidden from assistive tech", () => {
    const { container } = render(<Panel>x</Panel>);

    const brackets = container.querySelectorAll("[data-bracket]");
    expect(brackets).toHaveLength(4);
    for (const bracket of brackets) {
      expect(bracket.closest("[aria-hidden='true']")).not.toBeNull();
    }
  });

  it("applies the grid span class", () => {
    const { container } = render(<Panel span={8}>x</Panel>);

    expect(container.firstElementChild).toHaveClass("span-8");
  });

  it("adds the hero modifier only when size is hero", () => {
    const { container: base } = render(<Panel>x</Panel>);
    const { container: hero } = render(<Panel size="hero">x</Panel>);

    expect(hero.firstElementChild!.classList.length).toBe(base.firstElementChild!.classList.length + 1);
  });

  it("emits no span class when span is omitted", () => {
    const { container } = render(<Panel>x</Panel>);

    expect(container.firstElementChild!.className).not.toMatch(/span-/);
  });

  it("passes id and className through to the element", () => {
    const { container } = render(<Panel id="stack" className="extra">x</Panel>);

    expect(container.firstElementChild).toHaveAttribute("id", "stack");
    expect(container.firstElementChild).toHaveClass("extra");
  });
});

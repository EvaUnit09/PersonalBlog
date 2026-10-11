import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a link when given an href", () => {
    render(<Button href="/projects">View projects</Button>);

    expect(screen.getByRole("link", { name: "View projects" })).toHaveAttribute("href", "/projects");
  });

  it("renders a native button without an href", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Skip</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Skip" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("defaults native buttons to type=button so they never submit forms", () => {
    render(<Button>Skip</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("uses the primary variant by default and secondary on request", () => {
    render(
      <>
        <Button href="/a">A</Button>
        <Button href="/b" variant="secondary">B</Button>
      </>,
    );

    expect(screen.getByRole("link", { name: "A" }).dataset.variant).toBe("primary");
    expect(screen.getByRole("link", { name: "B" }).dataset.variant).toBe("secondary");
  });

  it("opens external links safely", () => {
    render(<Button href="https://github.com" target="_blank">GitHub</Button>);

    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });
});

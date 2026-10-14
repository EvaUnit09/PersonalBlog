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

  it("opens external https links in a new tab with noopener", () => {
    render(<Button href="https://github.com">GitHub</Button>);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.dataset.external).toBe("true");
  });

  it("treats protocol-relative hrefs as external new-tab links", () => {
    render(<Button href="//example.org">Elsewhere</Button>);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.dataset.external).toBe("true");
  });

  it("opens uppercase HTTP(S) hrefs in a new tab", () => {
    render(<Button href="HTTP://EXAMPLE.COM/x">Docs</Button>);

    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each(["#contact", "about", "?q=1", "mailto:a@b.dev", "tel:+15555550100", "http://localhost:3000/about"])(
    "keeps %s in the same tab",
    (href) => {
      render(<Button href={href}>{href}</Button>);
      const link = screen.getByRole("link");

      expect(link).not.toHaveAttribute("target", "_blank");
      expect(link.dataset.external).toBeUndefined();
    },
  );

  it("marks only hrefs starting with a single slash as internal", () => {
    render(<Button href="/log">Log</Button>);
    const link = screen.getByRole("link");

    expect(link.dataset.external).toBeUndefined();
    expect(link).not.toHaveAttribute("target", "_blank");
  });

  it("keeps hash and in-page routes in the same tab", () => {
    render(<Button href="/about#contact">Contact</Button>);

    expect(screen.getByRole("link")).not.toHaveAttribute("target", "_blank");
  });

  it("forces noopener on external links even if a caller passes rel", () => {
    render(<Button href="https://github.com/x" rel="me">GitHub</Button>);

    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("adds noopener when an internal link is explicitly asked to open in a new tab", () => {
    render(<Button href="/log" target="_blank">Log</Button>);

    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lets callers override type and merges className with the base classes", () => {
    render(<Button type="submit" className="extra">Send</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveClass("extra", "t-index");
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Skip</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });
});

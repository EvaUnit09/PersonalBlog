import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CONTACT_LINKS } from "@/content/site";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("shows the copyright readout with a city-level location", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(/© Noah Decaille · New York, NY/i);
  });

  it("links every contact channel in a new tab", () => {
    render(<SiteFooter />);

    for (const contact of CONTACT_LINKS) {
      const link = screen.getByRole("link", { name: new RegExp(contact.label, "i") });
      expect(link).toHaveAttribute("href", contact.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});

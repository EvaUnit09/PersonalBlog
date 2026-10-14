import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CONTACT_LINKS } from "@/content/site";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("shows the copyright readout with a city-level location", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(/© Noah Decaille · New York, NY/i);
  });

  it("opens http(s) contact channels in a new tab and leaves mailto here", () => {
    render(<SiteFooter />);

    for (const contact of CONTACT_LINKS) {
      const link = screen.getByRole("link", { name: new RegExp(contact.label, "i") });
      expect(link).toHaveAttribute("href", contact.href);
      if (contact.href.startsWith("mailto:")) {
        expect(link).not.toHaveAttribute("target", "_blank");
      } else {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
  });
});

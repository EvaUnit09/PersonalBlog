import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CONTACT_LINKS } from "@/content/site";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("shows the copyright readout with a city-level location", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(/© Noah Decaille · New York, NY/i);
  });

  it("links every contact channel", () => {
    render(<SiteFooter />);

    for (const contact of CONTACT_LINKS) {
      expect(screen.getByRole("link", { name: new RegExp(contact.label, "i") })).toHaveAttribute(
        "href",
        contact.href,
      );
    }
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ABOUT } from "@/content/about";
import { AboutIntroPanel } from "./AboutIntroPanel";
import { CertificationsPanel } from "./CertificationsPanel";
import { ContactPanel } from "./ContactPanel";
import { IdentityPanel } from "./IdentityPanel";
import { PathPanel } from "./PathPanel";

describe("AboutIntroPanel", () => {
  it("names the panel after its h1 and renders every bio paragraph", () => {
    render(<AboutIntroPanel about={ABOUT} />);
    const panel = screen.getByRole("region", { name: ABOUT.headline });

    expect(within(panel).getByRole("heading", { level: 1 })).toHaveTextContent(ABOUT.headline);
    for (const paragraph of ABOUT.bio) {
      expect(within(panel).getByText(paragraph)).toBeInTheDocument();
    }
  });
});

describe("IdentityPanel", () => {
  it("lists the identity rows and has no portrait placeholder", () => {
    render(<IdentityPanel rows={ABOUT.identity} isOpenToWork />);
    const panel = screen.getByRole("complementary", { name: "Identity" });

    expect(within(panel).queryByText(/PORTRAIT/)).not.toBeInTheDocument();
    expect(within(panel).getByText("ASTORIA, NYC")).toBeInTheDocument();
    expect(within(panel).getByText("NOAH DECAILLE")).toBeInTheDocument();
  });

  it("shows OPEN TO WORK only while open to work", () => {
    const { rerender } = render(<IdentityPanel rows={ABOUT.identity} isOpenToWork />);
    expect(screen.getByText("OPEN TO WORK")).toBeInTheDocument();

    rerender(<IdentityPanel rows={ABOUT.identity} isOpenToWork={false} />);
    expect(screen.queryByText("OPEN TO WORK")).not.toBeInTheDocument();
  });
});

describe("PathPanel", () => {
  it("numbers the stages and reports the real count", () => {
    render(<PathPanel stages={ABOUT.path} />);
    const panel = screen.getByRole("region", { name: "Path" });

    expect(within(panel).getAllByRole("listitem")).toHaveLength(ABOUT.path.length);
    expect(panel).toHaveTextContent(`${ABOUT.path.length} STAGES`);
    expect(panel).toHaveTextContent("03");
  });
});

describe("CertificationsPanel", () => {
  it("lists each certification with the resume wording", () => {
    render(<CertificationsPanel items={ABOUT.certifications} />);
    const panel = screen.getByRole("region", { name: "Certifications" });

    expect(within(panel).getAllByRole("listitem")).toHaveLength(ABOUT.certifications.length);
    expect(panel).toHaveTextContent("CompTIA Security+, A+ and Network+");
    expect(panel).toHaveTextContent("AWS Solutions Architect Associate (in progress)");
    expect(panel).toHaveTextContent("02 HELD");
  });
});

describe("ContactPanel", () => {
  const LINKS = [
    { label: "GitHub", href: "https://github.com/x" },
    { label: "Email", href: "mailto:a@b.dev" },
  ];

  it("is the #contact anchor target, named by its heading", () => {
    render(<ContactPanel prompt="Hiring?" links={LINKS} />);

    expect(screen.getByRole("region", { name: "Contact" })).toHaveAttribute("id", "contact");
  });

  it("makes email the primary action and every other link secondary", () => {
    render(<ContactPanel prompt="Hiring?" links={LINKS} />);

    expect(screen.getByRole("link", { name: "▸ Email me" })).toHaveAttribute("data-variant", "primary");
    expect(screen.getByRole("link", { name: "▸ Email me" })).toHaveAttribute("href", "mailto:a@b.dev");
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("data-variant", "secondary");
  });

  it("puts the email action first regardless of link order", () => {
    render(<ContactPanel prompt="Hiring?" links={LINKS} />);

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["▸ Email me", "GitHub"]);
  });

  it("has no resume or reply-time placeholders", () => {
    render(<ContactPanel prompt="Hiring?" links={LINKS} />);

    expect(screen.queryByText(/resume/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/reply time/i)).not.toBeInTheDocument();
  });
});

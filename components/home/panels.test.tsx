import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ExperienceEntry, LogEntry, Status } from "@/content/home";
import { EXPERIENCE, HERO, STACK, STATUS } from "@/content/home";
import { ExperiencePanel } from "./ExperiencePanel";
import { HeroPanel } from "./HeroPanel";
import { LogPanel } from "./LogPanel";
import { StackPanel } from "./StackPanel";
import { StatusPanel } from "./StatusPanel";

describe("HeroPanel", () => {
  it("names the about panel after the headline and hides the cursor", () => {
    render(<HeroPanel hero={HERO} />);
    const panel = screen.getByRole("region", { name: HERO.headline });

    expect(panel).toHaveAttribute("id", "about");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(HERO.headline);
    expect(screen.getByText("▌")).toHaveAttribute("aria-hidden", "true");
  });

  it("links the two calls to action", () => {
    render(<HeroPanel hero={HERO} />);

    expect(screen.getByRole("link", { name: /View projects/ })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/about#contact");
  });
});

describe("StatusPanel", () => {
  it("shows role, location, coordinates and previous employer", () => {
    render(<StatusPanel status={STATUS} />);

    const pairs = screen.getAllByRole("term").map((term) => [term.textContent, term.nextElementSibling?.textContent]);
    expect(pairs).toEqual([
      ["ROLE", STATUS.role],
      ["LOCATION", STATUS.location],
      ["COORD", STATUS.coordinates],
      ["PREV", STATUS.previous],
    ]);
  });

  it("has no BUILD readout until real CI data exists", () => {
    render(<StatusPanel status={STATUS} />);

    expect(screen.queryByText("BUILD")).not.toBeInTheDocument();
    expect(screen.queryByText(/PASSING/)).not.toBeInTheDocument();
  });

  it("shows availability only when open to work", () => {
    const closed: Status = { ...STATUS, isOpenToWork: false };
    const { rerender } = render(<StatusPanel status={STATUS} />);
    expect(screen.getByText("OPEN TO WORK")).toBeInTheDocument();
    expect(screen.getByText("available")).toBeInTheDocument();

    rerender(<StatusPanel status={closed} />);
    expect(screen.queryByText("OPEN TO WORK")).not.toBeInTheDocument();
    expect(screen.queryByText("available")).not.toBeInTheDocument();
  });
});

describe("ExperiencePanel", () => {
  it("renders a missing end as NOW and an explicit end as given", () => {
    const entries: ExperienceEntry[] = [
      { start: "2024", title: "Current", summary: "now" },
      { start: "2020", end: "2023", title: "Past", summary: "then" },
    ];
    const { container } = render(<ExperiencePanel entries={entries} />);
    const [current, past] = container.querySelectorAll("ol > li");

    expect(current).toHaveTextContent("2024 – NOW");
    expect(past).toHaveTextContent("2020 – 2023");
    expect(past).not.toHaveTextContent("NOW");
  });

  it("is the experience anchor target with an accessible name", () => {
    render(<ExperiencePanel entries={EXPERIENCE} />);

    expect(screen.getByRole("region", { name: "Experience" })).toHaveAttribute("id", "experience");
  });
});

describe("StackPanel", () => {
  it("lists daily and learning tags separately", () => {
    render(<StackPanel stack={STACK} />);
    const daily = screen.getByRole("list", { name: "Daily stack" });
    const learning = screen.getByRole("list", { name: "Learning" });

    expect(within(daily).getAllByRole("listitem")).toHaveLength(STACK.daily.length);
    expect(within(learning).getAllByRole("listitem")).toHaveLength(STACK.learning.length);
    expect(within(daily).queryByText(/SYSTEM DESIGN/i)).not.toBeInTheDocument();
  });
});

describe("LogPanel", () => {
  const entries: LogEntry[] = [
    { slug: "one", date: "2026-01-02", category: "BACKEND", title: "First", excerpt: "Ex one" },
    { slug: "two", date: "2026-02-03", category: "AGENTS", title: "Second", excerpt: "Ex two" },
  ];

  it("shows an empty state and no cards when there are no entries", () => {
    render(<LogPanel entries={[]} />);

    expect(screen.getByText("NO ENTRIES YET")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("shows a card per entry linking to its post, without the empty state", () => {
    render(<LogPanel entries={entries} />);

    expect(screen.queryByText("NO ENTRIES YET")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /First/ })).toHaveAttribute("href", "/log/one");
    expect(screen.getByRole("link", { name: /Second/ })).toHaveAttribute("href", "/log/two");
    expect(screen.getByText("BACKEND")).toBeInTheDocument();
  });

  it("always links to the full log", () => {
    render(<LogPanel entries={[]} />);

    expect(screen.getByRole("link", { name: /ALL ENTRIES/ })).toHaveAttribute("href", "/log");
    expect(screen.getByRole("region", { name: "Log" })).toHaveAttribute("id", "log");
  });
});

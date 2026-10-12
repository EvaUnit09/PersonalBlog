import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project, ProjectList } from "@/lib/content/projects";
import { AlsoBuiltPanel } from "./AlsoBuiltPanel";
import { FeaturedPanel } from "./FeaturedPanel";

function project(slug: string, overrides: Partial<Project> = {}): Project {
  return {
    slug,
    title: `Title ${slug}`,
    summary: `Summary ${slug}`,
    tags: [`Tag ${slug}`],
    order: 1,
    links: {},
    spec: [],
    body: "",
    status: "shipped",
    ...overrides,
  };
}

const PROJECTS: ProjectList = [
  project("alpha", { status: "in-progress" }),
  project("beta"),
  project("gamma"),
  project("delta"),
];

describe("FeaturedPanel", () => {
  it("features the first project and links to its write-up", () => {
    render(<FeaturedPanel projects={PROJECTS} />);
    const panel = screen.getByRole("region", { name: "Title alpha" });

    expect(within(panel).getByText("Summary alpha")).toBeInTheDocument();
    expect(within(panel).queryByText("Title beta")).not.toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: /Read the write-up/ })).toHaveAttribute(
      "href",
      "/projects/alpha",
    );
  });

  it("derives the position readout from the project count", () => {
    const { rerender } = render(<FeaturedPanel projects={PROJECTS} />);
    expect(screen.getByText("PROJECT 01 OF 04")).toBeInTheDocument();

    rerender(<FeaturedPanel projects={[PROJECTS[0], PROJECTS[1]]} />);
    expect(screen.getByText("PROJECT 01 OF 02")).toBeInTheDocument();
  });

  it("tags the featured project with its own stack", () => {
    render(<FeaturedPanel projects={PROJECTS} />);
    const stack = screen.getByRole("list", { name: "Stack" });

    expect(within(stack).getByText("[Tag alpha]")).toBeInTheDocument();
    expect(within(stack).queryByText("[Tag beta]")).not.toBeInTheDocument();
  });

  it("shows the featured project's status", () => {
    render(<FeaturedPanel projects={PROJECTS} />);

    expect(screen.getByText("STATUS: IN PROGRESS")).toBeInTheDocument();
  });

  it("hides the decorative screenshot placeholder from assistive tech", () => {
    render(<FeaturedPanel projects={PROJECTS} />);

    expect(screen.getByText(/SCREENSHOT/).closest("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("AlsoBuiltPanel", () => {
  it("lists every project except the featured one, indexed from 02", () => {
    const { container } = render(<AlsoBuiltPanel projects={PROJECTS} />);
    const rows = container.querySelectorAll("ol > li");

    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent("02");
    expect(rows[0]).toHaveTextContent("Title beta");
    expect(rows[1]).toHaveTextContent("03");
    expect(rows[2]).toHaveTextContent("04");
    expect(screen.queryByText("Title alpha")).not.toBeInTheDocument();
  });

  it("shows each row's own summary and tags", () => {
    render(<AlsoBuiltPanel projects={PROJECTS} />);

    expect(screen.getByText("Summary beta")).toBeInTheDocument();
    const betaStack = screen.getByRole("list", { name: "Title beta stack" });
    expect(within(betaStack).getByText("[Tag beta]")).toBeInTheDocument();
    expect(within(betaStack).queryByText("[Tag gamma]")).not.toBeInTheDocument();
  });

  it("links ALL to the projects index", () => {
    render(<AlsoBuiltPanel projects={PROJECTS} />);

    expect(screen.getByRole("link", { name: /ALL/ })).toHaveAttribute("href", "/projects");
  });
});

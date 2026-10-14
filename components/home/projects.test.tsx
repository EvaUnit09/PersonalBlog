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
  project("alpha", { order: 1, status: "in-progress", links: { demo: "https://alpha.example" } }),
  project("beta", { order: 2 }),
  project("gamma", { order: 3, links: { demo: "https://gamma.example" } }),
  project("delta", { order: 4 }),
];

const FEATURED = ["alpha", "gamma"] as const;

describe("FeaturedPanel", () => {
  it("renders each featured project as its own card with the write-up link", () => {
    render(<FeaturedPanel projects={PROJECTS} featuredSlugs={FEATURED} />);
    const panel = screen.getByRole("region", { name: "Featured" });
    const alpha = within(panel).getByRole("article", { name: "Title alpha" });
    const gamma = within(panel).getByRole("article", { name: "Title gamma" });

    expect(within(alpha).getByText("Summary alpha")).toBeInTheDocument();
    expect(within(gamma).getByText("Summary gamma")).toBeInTheDocument();
    expect(within(panel).queryByText("Title beta")).not.toBeInTheDocument();
    expect(within(alpha).getByRole("link", { name: /Read the write-up/ })).toHaveAttribute(
      "href",
      "/projects/alpha",
    );
  });

  it("keeps each card's project counter on that card's own order", () => {
    render(<FeaturedPanel projects={PROJECTS} featuredSlugs={FEATURED} />);
    const alpha = screen.getByRole("article", { name: "Title alpha" });
    const gamma = screen.getByRole("article", { name: "Title gamma" });

    expect(within(alpha).getByText("PROJECT 01 OF 04")).toBeInTheDocument();
    expect(within(gamma).getByText("PROJECT 03 OF 04")).toBeInTheDocument();
    expect(screen.getByText("02 FEATURED")).toBeInTheDocument();
  });

  it("tags each featured project with its own stack", () => {
    render(<FeaturedPanel projects={PROJECTS} featuredSlugs={FEATURED} />);
    const alphaStack = screen.getByRole("list", { name: "Title alpha stack" });
    const gammaStack = screen.getByRole("list", { name: "Title gamma stack" });

    expect(within(alphaStack).getByText("[Tag alpha]")).toBeInTheDocument();
    expect(within(alphaStack).queryByText("[Tag gamma]")).not.toBeInTheDocument();
    expect(within(gammaStack).getByText("[Tag gamma]")).toBeInTheDocument();
  });

  it("shows each featured project's status", () => {
    render(<FeaturedPanel projects={PROJECTS} featuredSlugs={FEATURED} />);

    expect(within(screen.getByRole("article", { name: "Title alpha" })).getByText("STATUS: CURRENTLY BUILDING")).toBeInTheDocument();
    expect(within(screen.getByRole("article", { name: "Title gamma" })).getByText("STATUS: SHIPPED")).toBeInTheDocument();
  });

  it("links a live demo when the project has one", () => {
    render(<FeaturedPanel projects={PROJECTS} featuredSlugs={FEATURED} />);

    expect(
      within(screen.getByRole("article", { name: "Title alpha" })).getByRole("link", { name: /Live demo/ }),
    ).toHaveAttribute("href", "https://alpha.example");
    expect(
      within(screen.getByRole("article", { name: "Title gamma" })).getByRole("link", { name: /Live demo/ }),
    ).toHaveAttribute("href", "https://gamma.example");
  });

  it("has no screenshot placeholder", () => {
    render(<FeaturedPanel projects={PROJECTS} featuredSlugs={FEATURED} />);

    expect(screen.queryByText(/SCREENSHOT/)).not.toBeInTheDocument();
  });
});

describe("AlsoBuiltPanel", () => {
  it("lists every project except featured ones, using each project's order", () => {
    const { container } = render(<AlsoBuiltPanel projects={PROJECTS} featuredSlugs={FEATURED} />);
    const rows = container.querySelectorAll("ol > li");

    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("02");
    expect(rows[0]).toHaveTextContent("Title beta");
    expect(rows[1]).toHaveTextContent("04");
    expect(rows[1]).toHaveTextContent("Title delta");
    expect(screen.queryByText("Title alpha")).not.toBeInTheDocument();
    expect(screen.queryByText("Title gamma")).not.toBeInTheDocument();
  });

  it("shows each row's own summary and tags", () => {
    render(<AlsoBuiltPanel projects={PROJECTS} featuredSlugs={FEATURED} />);

    expect(screen.getByText("Summary beta")).toBeInTheDocument();
    const betaStack = screen.getByRole("list", { name: "Title beta stack" });
    expect(within(betaStack).getByText("[Tag beta]")).toBeInTheDocument();
    expect(within(betaStack).queryByText("[Tag delta]")).not.toBeInTheDocument();
  });

  it("links ALL to the projects index", () => {
    render(<AlsoBuiltPanel projects={PROJECTS} featuredSlugs={FEATURED} />);

    expect(screen.getByRole("link", { name: /ALL/ })).toHaveAttribute("href", "/projects");
  });
});

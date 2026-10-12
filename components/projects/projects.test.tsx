import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project, ProjectList } from "@/lib/content/projects";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectsIndexPanel } from "./ProjectsIndexPanel";

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
    status: "in-progress",
    ...overrides,
  };
}

const NEIGHBORS = { previous: undefined, next: undefined };

describe("ProjectsIndexPanel", () => {
  const projects: ProjectList = [project("alpha"), project("beta", { status: "shipped" })];

  it("shows every project as a numbered row linking to its page, with the count in the header", () => {
    render(<ProjectsIndexPanel projects={projects} />);
    const panel = screen.getByRole("region", { name: "Projects" });
    const rows = within(panel).getAllByRole("listitem").filter((row) => row.querySelector("a"));

    expect(within(panel).getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
    expect(panel).toHaveTextContent("02 TOTAL");
    expect(rows).toHaveLength(2);
    expect(within(rows[0]!).getByRole("link", { name: "Title alpha" })).toHaveAttribute("href", "/projects/alpha");
    expect(rows[0]).toHaveTextContent("01");
    expect(rows[1]).toHaveTextContent("02");
    expect(rows[0]).toHaveTextContent("STATUS: CURRENTLY BUILDING");
    expect(rows[1]).toHaveTextContent("STATUS: SHIPPED");
    expect(rows[1]).toHaveTextContent("Summary beta");
  });
});

describe("ProjectDetail", () => {
  it("shows position in the breadcrumb and omits UPDATED without an updated date", () => {
    render(<ProjectDetail project={project("alpha")} position={2} total={4} neighbors={NEIGHBORS} />);
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });

    expect(crumbs).toHaveTextContent("◂ ALL PROJECTS · 02 / PROJECT 02 OF 04");
    expect(crumbs).not.toHaveTextContent("UPDATED");
  });

  it("appends UPDATED to the breadcrumb when the project has an updated date", () => {
    render(
      <ProjectDetail project={project("alpha", { updated: "2026-03-04" })} position={1} total={4} neighbors={NEIGHBORS} />,
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
      "02 / PROJECT 01 OF 04 · UPDATED 2026-03-04",
    );
  });

  it("renders title, summary and tags in the hero", () => {
    render(<ProjectDetail project={project("alpha")} position={1} total={1} neighbors={NEIGHBORS} />);

    expect(screen.getByRole("heading", { level: 1, name: "Title alpha" })).toBeInTheDocument();
    expect(screen.getAllByText("Summary alpha")).toHaveLength(1);
    expect(screen.getByRole("list", { name: "Stack" })).toHaveTextContent("[Tag alpha]");
  });

  it("renders link buttons only for links that exist", () => {
    const { rerender } = render(
      <ProjectDetail
        project={project("alpha", { links: { demo: "https://demo.dev/x", source: "https://github.com/x/y" } })}
        position={1}
        total={1}
        neighbors={NEIGHBORS}
      />,
    );
    const hero = screen.getByRole("region", { name: "Title alpha" });

    expect(within(hero).getByRole("link", { name: "▸ Live demo" })).toHaveAttribute("href", "https://demo.dev/x");
    expect(within(hero).getByRole("link", { name: "Source on GitHub" })).toHaveAttribute("href", "https://github.com/x/y");
    expect(within(hero).getByRole("link", { name: "▸ Live demo" })).toHaveAttribute("data-variant", "primary");

    rerender(
      <ProjectDetail
        project={project("alpha", { links: { source: "https://github.com/x/y" } })}
        position={1}
        total={1}
        neighbors={NEIGHBORS}
      />,
    );
    expect(screen.queryByRole("link", { name: /Live demo/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Source/i })).toHaveLength(2);

    rerender(<ProjectDetail project={project("alpha")} position={1} total={1} neighbors={NEIGHBORS} />);
    expect(screen.queryByRole("link", { name: /Source|Live demo/ })).not.toBeInTheDocument();
  });

  it("gives the SPEC links names distinct from the hero links", () => {
    render(
      <ProjectDetail
        project={project("alpha", { links: { demo: "https://demo.dev/x", source: "https://github.com/x/y" } })}
        position={1}
        total={1}
        neighbors={NEIGHBORS}
      />,
    );
    const spec = screen.getByRole("complementary", { name: "Project facts" });

    expect(within(spec).getByRole("link", { name: "Title alpha live demo" })).toHaveAttribute("href", "https://demo.dev/x");
    expect(within(spec).getByRole("link", { name: "Title alpha source" })).toHaveAttribute("href", "https://github.com/x/y");
    expect(screen.getAllByRole("link", { name: "▸ Live demo" })).toHaveLength(1);
  });

  it("lists STATUS first in the SPEC readout, then spec rows in authored order", () => {
    render(
      <ProjectDetail
        project={project("alpha", {
          spec: [
            { label: "Role", value: "Solo" },
            { label: "Backend", value: "FastAPI" },
          ],
        })}
        position={1}
        total={1}
        neighbors={NEIGHBORS}
      />,
    );
    const spec = screen.getByRole("complementary", { name: "Project facts" });
    const labels = within(spec).getAllByRole("term").map((term) => term.textContent);

    expect(labels).toEqual(["STATUS", "Role", "Backend"]);
    expect(spec).toHaveTextContent("CURRENTLY BUILDING");
    expect(spec).toHaveTextContent("FastAPI");
  });

  it("renders the write-up only when a body is given", () => {
    const { rerender } = render(<ProjectDetail project={project("alpha")} position={1} total={1} neighbors={NEIGHBORS} />);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();

    rerender(
      <ProjectDetail project={project("alpha")} position={1} total={1} neighbors={NEIGHBORS} body={<p>Write-up text</p>} />,
    );
    expect(within(screen.getByRole("article", { name: "Title alpha write-up" })).getByText("Write-up text")).toBeInTheDocument();
  });

  it("links the previous and next projects and omits a missing side", () => {
    const { rerender } = render(
      <ProjectDetail
        project={project("beta")}
        position={2}
        total={3}
        neighbors={{ previous: project("alpha"), next: project("gamma") }}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Project navigation" });

    expect(within(nav).getByRole("link", { name: /Title alpha/ })).toHaveAttribute("href", "/projects/alpha");
    expect(within(nav).getByRole("link", { name: /Title gamma/ })).toHaveAttribute("href", "/projects/gamma");

    rerender(
      <ProjectDetail project={project("alpha")} position={1} total={3} neighbors={{ previous: undefined, next: project("beta") }} />,
    );
    expect(screen.queryByText(/PREVIOUS/)).not.toBeInTheDocument();
    expect(screen.getByText(/NEXT/)).toBeInTheDocument();
  });
});

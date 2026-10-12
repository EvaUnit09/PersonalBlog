import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Crumbs } from "./Crumbs";
import { PostNav } from "./PostNav";

const PREVIOUS = { href: "/projects/foodsy", title: "Foodsy" };
const NEXT = { href: "/projects/opsagent", title: "OpsAgent" };

describe("PostNav", () => {
  it("links both neighbors, previous first", () => {
    render(<PostNav label="Project navigation" previous={PREVIOUS} next={NEXT} />);
    const links = screen.getAllByRole("link");

    expect(screen.getByRole("navigation", { name: "Project navigation" })).toBeInTheDocument();
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/projects/foodsy", "/projects/opsagent"]);
    expect(links[0]).toHaveTextContent("◂ PREVIOUS");
    expect(links[0]).toHaveTextContent("Foodsy");
    expect(links[1]).toHaveTextContent("NEXT ▸");
    expect(links[1]).toHaveTextContent("OpsAgent");
  });

  it("renders only the previous link when there is no next", () => {
    render(<PostNav label="Post navigation" previous={PREVIOUS} next={undefined} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link")).toHaveTextContent("◂ PREVIOUS");
    expect(screen.queryByText(/NEXT/)).not.toBeInTheDocument();
  });

  it("renders only the next link when there is no previous", () => {
    render(<PostNav label="Post navigation" previous={undefined} next={NEXT} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link")).toHaveTextContent("NEXT ▸");
    expect(screen.queryByText(/PREVIOUS/)).not.toBeInTheDocument();
  });

  it("renders nothing when there are no neighbors", () => {
    const { container } = render(<PostNav label="Post navigation" previous={undefined} next={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe("Crumbs", () => {
  it("shows a back link followed by the readouts", () => {
    render(<Crumbs backHref="/projects" backLabel="ALL PROJECTS" items={["02 / PROJECT 01 OF 04"]} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });

    expect(screen.getByRole("link", { name: "◂ ALL PROJECTS" })).toHaveAttribute("href", "/projects");
    expect(nav).toHaveTextContent("◂ ALL PROJECTS · 02 / PROJECT 01 OF 04");
  });
});

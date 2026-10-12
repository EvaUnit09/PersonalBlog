import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Post } from "@/lib/content/log";
import { LogIndexPanel } from "./LogIndexPanel";
import { LogPostView } from "./LogPostView";

function post(slug: string, overrides: Partial<Post> = {}): Post {
  return {
    slug,
    title: `Title ${slug}`,
    date: "2026-10-11",
    excerpt: `Excerpt ${slug}`,
    tags: ["Backend", "Django"],
    body: "",
    number: 4,
    readingMinutes: 3,
    ...overrides,
  };
}

describe("LogIndexPanel", () => {
  it("shows the empty state and no list when there are no posts", () => {
    render(<LogIndexPanel posts={[]} />);

    expect(screen.getByText("NO ENTRIES YET")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("lists posts in the given order with number, date, reading time, link, excerpt and tags", () => {
    render(<LogIndexPanel posts={[post("new", { number: 2, date: "2026-02-01" }), post("old", { number: 1, date: "2026-01-01" })]} />);
    const rows = screen.getAllByRole("listitem").filter((row) => row.querySelector("a"));

    expect(screen.queryByText("NO ENTRIES YET")).not.toBeInTheDocument();
    expect(rows.map((row) => within(row).getByRole("link", { name: /^Title/ }).textContent)).toEqual(["Title new", "Title old"]);
    expect(within(rows[0]!).getByRole("link", { name: "Title new" })).toHaveAttribute("href", "/log/new");
    expect(rows[0]).toHaveTextContent("LOG #02");
    expect(rows[0]).toHaveTextContent("2026-02-01");
    expect(rows[0]).toHaveTextContent("3 MIN READ");
    expect(rows[0]).toHaveTextContent("Excerpt new");
    expect(rows[0]).toHaveTextContent("[Backend]");
    expect(rows[1]).toHaveTextContent("LOG #01");
    expect(within(rows[0]!).getByText("2026-02-01")).toHaveAttribute("datetime", "2026-02-01");
  });
});

describe("LogPostView", () => {
  const NO_NEIGHBORS = { previous: undefined, next: undefined };

  it("shows the entry number, date and reading time in the breadcrumb", () => {
    render(<LogPostView post={post("a")} neighbors={NO_NEIGHBORS} body={<p>Body</p>} />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
      "◂ ALL ENTRIES · 04 / LOG #04 · 2026-10-11 · 3 MIN READ",
    );
    expect(screen.getByRole("link", { name: "◂ ALL ENTRIES" })).toHaveAttribute("href", "/log");
  });

  it("marks the post date up as a machine-readable time", () => {
    render(<LogPostView post={post("a", { date: "2026-03-04" })} neighbors={NO_NEIGHBORS} body={null} />);

    expect(screen.getByText("2026-03-04")).toHaveAttribute("datetime", "2026-03-04");
  });

  it("renders the title as h1, the excerpt as lede, the body, and the tags both above and below", () => {
    render(<LogPostView post={post("a")} neighbors={NO_NEIGHBORS} body={<p>Body text</p>} />);

    expect(screen.getByRole("heading", { level: 1, name: "Title a" })).toBeInTheDocument();
    expect(screen.getByText("Excerpt a")).toBeInTheDocument();
    expect(within(screen.getByRole("article")).getByText("Body text")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Topics" })).toHaveTextContent("[Backend][Django]");
    expect(screen.getByRole("list", { name: "Tags" })).toHaveTextContent("[Backend][Django]");
  });

  it("links the older post as previous and the newer post as next", () => {
    render(
      <LogPostView
        post={post("b")}
        neighbors={{ previous: post("a"), next: post("c") }}
        body={null}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Post navigation" });

    expect(within(nav).getByRole("link", { name: /PREVIOUS/ })).toHaveAttribute("href", "/log/a");
    expect(within(nav).getByRole("link", { name: /NEXT/ })).toHaveAttribute("href", "/log/c");
  });

  it("omits the post navigation for the only post", () => {
    render(<LogPostView post={post("a")} neighbors={NO_NEIGHBORS} body={null} />);

    expect(screen.queryByRole("navigation", { name: "Post navigation" })).not.toBeInTheDocument();
  });
});

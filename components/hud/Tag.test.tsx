import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag, TagList } from "./Tag";

describe("Tag", () => {
  it("wraps the label in brackets", () => {
    render(<Tag label="Django" />);

    expect(screen.getByText("[Django]")).toBeInTheDocument();
  });
});

describe("TagList", () => {
  it("renders every tag as a list item", () => {
    render(<TagList tags={["Python", "Postgres"]} label="Stack" />);

    const list = screen.getByRole("list", { name: "Stack" });
    expect(list.querySelectorAll("li")).toHaveLength(2);
  });
});

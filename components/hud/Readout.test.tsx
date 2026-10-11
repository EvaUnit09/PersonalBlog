import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReadoutBar, ReadoutRow } from "./Readout";

describe("ReadoutRow", () => {
  it("pairs a label with a value as a description list entry", () => {
    render(
      <dl>
        <ReadoutRow label="Role" value="Backend / Full-stack" />
      </dl>,
    );

    expect(screen.getByRole("term")).toHaveTextContent("Role");
    expect(screen.getByRole("definition")).toHaveTextContent("Backend / Full-stack");
  });
});

describe("ReadoutBar", () => {
  it("joins items with a decorative middot", () => {
    const { container } = render(<ReadoutBar items={["2026-10-11", "6 MIN", "BACKEND"]} />);

    expect(container).toHaveTextContent("2026-10-11 · 6 MIN · BACKEND");
    const separators = container.querySelectorAll("[aria-hidden='true']");
    expect(separators).toHaveLength(2);
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<ReadoutBar items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});

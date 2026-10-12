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

  it("puts the accent modifier on the value only", () => {
    const { container } = render(
      <dl>
        <ReadoutRow label="Build" value="Passing" />
        <ReadoutRow label="Build" value="Passing" isAccent />
      </dl>,
    );
    const [plainTerm, accentTerm] = container.querySelectorAll("dt");
    const [plainValue, accentValue] = container.querySelectorAll("dd");

    expect(accentValue.classList.length).toBe(plainValue.classList.length + 1);
    expect(accentTerm.className).toBe(plainTerm.className);
  });

  it("adds the ruled modifier to the row", () => {
    const { container } = render(
      <dl>
        <ReadoutRow label="A" value="1" />
        <ReadoutRow label="B" value="2" isRuled />
      </dl>,
    );
    const [plain, ruled] = container.querySelectorAll("dl > div");

    expect(ruled.classList.length).toBe(plain.classList.length + 1);
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

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PanelHeader } from "./PanelHeader";

describe("PanelHeader", () => {
  it("renders the index, label and right-hand readout", () => {
    render(<PanelHeader index="01" label="About" readout="NYC / ASTORIA" />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("NYC / ASTORIA")).toBeInTheDocument();
  });

  it("puts labelId on the label so a panel can reference it", () => {
    render(
      <section aria-labelledby="xp">
        <PanelHeader index="03" label="Experience" labelId="xp" />
      </section>,
    );

    expect(screen.getByRole("region", { name: "Experience" })).toBeInTheDocument();
  });

  it("omits the readout when none is given", () => {
    const { container } = render(<PanelHeader index="//" label="Status" />);

    expect(container.querySelector("[data-readout]")).toBeNull();
  });
});

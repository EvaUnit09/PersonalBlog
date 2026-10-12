import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListRow } from "./ListRow";
import styles from "./ListRow.module.css";

describe("ListRow", () => {
  it("renders marker, title and summary as one list item", () => {
    render(
      <ol>
        <ListRow marker="02" title="Foodsy" summary="Food app." />
      </ol>,
    );
    const item = screen.getByRole("listitem");

    expect(item).toHaveTextContent("02");
    expect(within(item).getByText("Foodsy")).toBeInTheDocument();
    expect(within(item).getByText("Food app.")).toBeInTheDocument();
  });

  it("renders children below the summary only when given", () => {
    render(
      <ol>
        <ListRow marker="02" title="A" summary="a" />
        <ListRow marker="03" title="B" summary="b">
          <span>extra</span>
        </ListRow>
      </ol>,
    );
    const [plain, withExtra] = screen.getAllByRole("listitem");

    expect(within(plain).queryByText("extra")).not.toBeInTheDocument();
    expect(within(withExtra).getByText("extra")).toBeInTheDocument();
  });

  it("uses a different marker column for periods than for indexes", () => {
    render(
      <ol>
        <ListRow marker="02" title="A" summary="a" />
        <ListRow marker="2024 – 2026" markerSize="period" title="B" summary="b" />
      </ol>,
    );

    expect(screen.getByText("02")).toHaveClass(styles.index);
    expect(screen.getByText("2024 – 2026")).toHaveClass(styles.period);
    expect(screen.getByText("2024 – 2026")).not.toHaveClass(styles.index);
  });
});

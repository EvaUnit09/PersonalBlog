import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusDot } from "./StatusDot";
import styles from "./StatusDot.module.css";

describe("StatusDot", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<StatusDot tone="warn" />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it.each(["accent", "warn"] as const)("applies the %s tone class", (tone) => {
    const { container } = render(<StatusDot tone={tone} />);

    expect(container.firstElementChild).toHaveClass(styles[tone] as string);
  });
});

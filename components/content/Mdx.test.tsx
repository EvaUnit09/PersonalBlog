import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Mdx } from "./Mdx";

async function renderMdx(source: string) {
  return render(await Mdx({ source }));
}

describe("Mdx", () => {
  it("renders markdown inside the prose measure", async () => {
    const { container } = await renderMdx("Keep everything in one `settings.py`.");

    expect(container.querySelector("[data-prose] p code")).toHaveTextContent("settings.py");
  });

  it("highlights fenced code with theme-aware token colours", async () => {
    await renderMdx("```python\n# settings/base.py\nfrom pathlib import Path\n```");
    const sample = screen.getByRole("region", { name: "Code sample" });

    expect(within(sample).getByText("# settings/base.py")).toHaveStyle({ color: "var(--code-token-comment)" });
    expect(within(sample).getByText("from")).toHaveStyle({ color: "var(--code-token-keyword)" });
  });

  it("makes code samples keyboard-scrollable", async () => {
    await renderMdx("```\nplain\n```");

    expect(screen.getByRole("region", { name: "Code sample" })).toHaveAttribute("tabindex", "0");
  });

  it("does not evaluate JavaScript expressions in content", async () => {
    const { container } = await renderMdx("Total: {1 + 1}");

    expect(container).not.toHaveTextContent("Total: 2");
  });
});

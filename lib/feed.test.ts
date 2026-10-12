import { describe, expect, it } from "vitest";
import { buildFeed, escapeXml, toRfc822 } from "./feed";

const BASE = { origin: "https://noah.dev", title: "Noah Decaille: Log", description: "Notes." };

describe("escapeXml", () => {
  it("escapes ampersands, angle brackets and both quote kinds", () => {
    expect(escapeXml(`A & B <i> "q" 'a'`)).toBe("A &amp; B &lt;i&gt; &quot;q&quot; &apos;a&apos;");
  });

  it("escapes an ampersand once, not inside the entities it produces", () => {
    expect(escapeXml("&lt;")).toBe("&amp;lt;");
  });
});

describe("toRfc822", () => {
  it("formats a calendar day as midnight GMT", () => {
    expect(toRfc822("2026-10-11")).toBe("Sun, 11 Oct 2026 00:00:00 GMT");
  });
});

describe("buildFeed", () => {
  it("is a valid empty channel when there are no posts", () => {
    const xml = buildFeed({ ...BASE, posts: [] });

    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain("<title>Noah Decaille: Log</title>");
    expect(xml).toContain("<link>https://noah.dev/log</link>");
    expect(xml).not.toContain("<item>");
  });

  it("emits one item per post with link, guid, pubDate and excerpt", () => {
    const xml = buildFeed({
      ...BASE,
      posts: [
        { slug: "b", title: "Second", date: "2026-02-01", excerpt: "Two." },
        { slug: "a", title: "First", date: "2026-01-01", excerpt: "One." },
      ],
    });

    expect(xml.match(/<item>/g)).toHaveLength(2);
    expect(xml).toContain("<link>https://noah.dev/log/b</link>");
    expect(xml).toContain("<guid>https://noah.dev/log/b</guid>");
    expect(xml).toContain("<pubDate>Sun, 01 Feb 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<description>Two.</description>");
    expect(xml.indexOf("Second")).toBeLessThan(xml.indexOf("First"));
  });

  it("escapes every text field so markup in a post cannot break the document", () => {
    const xml = buildFeed({
      origin: "https://noah.dev",
      title: "A & B",
      description: "<script>",
      posts: [{ slug: "x", title: `Q "1" & <2>`, date: "2026-01-01", excerpt: "it's <b>bold</b>" }],
    });

    expect(xml).toContain("<title>A &amp; B</title>");
    expect(xml).toContain("<description>&lt;script&gt;</description>");
    expect(xml).toContain("<title>Q &quot;1&quot; &amp; &lt;2&gt;</title>");
    expect(xml).toContain("<description>it&apos;s &lt;b&gt;bold&lt;/b&gt;</description>");
    expect(xml).not.toContain("<script>");
    expect(xml).not.toContain("<b>");
  });
});

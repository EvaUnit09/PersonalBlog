import type { Metadata } from "next";
import { archivo, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Noah Decaille",
    template: "Noah Decaille: %s",
  },
  description: "Backend engineer. Network nerd turned developer.",
};

// data-theme is hardcoded to dark until the pre-paint theme script lands (Phase 4).
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { archivo, jetbrainsMono } from "./fonts";
import "./globals.css";
import styles from "./layout.module.css";

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
      <body>
        <div className={styles.shell}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

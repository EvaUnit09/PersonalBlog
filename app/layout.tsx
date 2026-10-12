import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Boot } from "@/components/boot/Boot";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { bootInitScript } from "@/lib/boot";
import { getSiteOrigin } from "@/lib/site-url";
import { themeInitScript } from "@/lib/theme";
import { archivo, jetbrainsMono } from "./fonts";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: "Noah Decaille",
    template: "Noah Decaille: %s",
  },
  description: "Backend engineer. Network nerd turned developer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
        <script dangerouslySetInnerHTML={{ __html: bootInitScript() }} />
      </head>
      <body>
        <Boot />
        <div className={styles.shell}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  );
}

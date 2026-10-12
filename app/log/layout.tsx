import type { Metadata } from "next";
import { LOG_FEED_PATH } from "@/content/log";

export const metadata: Metadata = {
  alternates: { types: { "application/rss+xml": LOG_FEED_PATH } },
};

export default function LogLayout({ children }: LayoutProps<"/log">) {
  return children;
}

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Brackets } from "./Brackets";
import styles from "./Panel.module.css";

type PanelElement = "section" | "aside" | "article" | "div";
type GridSpan = 3 | 4 | 5 | 6 | 7 | 8 | 12;

interface PanelProps extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  as?: PanelElement;
  /** Columns to span in the 12-column `.grid`. */
  span?: GridSpan;
  size?: "default" | "hero";
  children: ReactNode;
}

/** Square bg-100 tile with corner brackets that turn lime on hover or focus. */
export function Panel({
  as: Element = "section",
  span,
  size = "default",
  className,
  children,
  ...rest
}: PanelProps) {
  return (
    <Element
      className={cx(styles.panel, size === "hero" && styles.hero, span && `span-${span}`, className)}
      {...rest}
    >
      <Brackets />
      {children}
    </Element>
  );
}

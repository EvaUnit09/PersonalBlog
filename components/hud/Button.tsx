import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { NEW_TAB_REL, isInternalHref } from "@/lib/external-href";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

interface CommonProps {
  /** Primary is lime fill with on-accent text; secondary is a 1px outline. */
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type LinkAttrs = Omit<ComponentPropsWithoutRef<"a">, "className" | "children"> & { href: string };
type NativeAttrs = Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
  href?: undefined;
};

export type ButtonProps = CommonProps & (LinkAttrs | NativeAttrs);

function isLinkAttrs(attrs: LinkAttrs | NativeAttrs): attrs is LinkAttrs {
  return typeof attrs.href === "string";
}

/**
 * Renders next/link for site-relative hrefs ("/log"), a plain <a> for everything
 * else (https:, mailto:, protocol-relative "//host"), or a native <button> when
 * no href is given. External hrefs always open in a new tab with
 * rel="noopener noreferrer". An explicit target="_blank" on an internal href
 * gets the same rel.
 */
export function Button({ variant = "primary", className, children, ...attrs }: ButtonProps) {
  const shared = {
    className: cx(styles.button, styles[variant], "t-index", className),
    "data-variant": variant,
  };

  if (!isLinkAttrs(attrs)) {
    return (
      <button type="button" {...attrs} {...shared}>
        {children}
      </button>
    );
  }

  if (isInternalHref(attrs.href)) {
    const rel = attrs.target === "_blank" ? NEW_TAB_REL : attrs.rel;
    return (
      <Link {...attrs} rel={rel} {...shared}>
        {children}
      </Link>
    );
  }

  return (
    <a {...attrs} target="_blank" rel={NEW_TAB_REL} data-external="true" {...shared}>
      {children}
    </a>
  );
}

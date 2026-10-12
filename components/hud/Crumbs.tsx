import Link from "next/link";
import { ReadoutBar } from "./Readout";

interface CrumbsProps {
  backHref: string;
  /** Text after the arrow, e.g. "ALL PROJECTS". */
  backLabel: string;
  /** Readouts after the back link, joined by "·". */
  items: readonly string[];
  className?: string;
}

/** Back link plus position readouts at the top of a detail page. */
export function Crumbs({ backHref, backLabel, items, className }: CrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ReadoutBar items={[<Link key="back" href={backHref}>◂ {backLabel}</Link>, ...items]} />
    </nav>
  );
}

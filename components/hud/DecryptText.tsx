"use client";

import { useEffect, useRef, useState } from "react";
import { onBootSettled } from "@/lib/boot";
import { DECRYPT_MS, decryptFrame, pickRandomGlyph } from "@/lib/decrypt";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./DecryptText.module.css";

interface DecryptTextProps {
  text: string;
  id?: string;
}

/**
 * Scrambles into place once, the first time it scrolls into view. The real text stays in
 * the DOM (transparent while scrambling) so layout and the accessible name never change;
 * the glyph frame is an aria-hidden overlay that exists only during the animation.
 */
export function DecryptText({ text, id }: DecryptTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [frame, setFrame] = useState<string | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (element === null || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    const animate = () => {
      let start: number | null = null;
      const tick = (now: number) => {
        start ??= now;
        const progress = (now - start) / DECRYPT_MS;
        setFrame(progress >= 1 ? null : decryptFrame(text, progress, pickRandomGlyph));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      animate();
    });
    // Labels sit under the boot overlay on a first visit; decrypting there would go unseen.
    const cancelWait = onBootSettled(() => observer.observe(element));

    return () => {
      cancelWait();
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  const isScrambling = frame !== null;
  return (
    <span id={id} ref={ref} className={styles.root}>
      <span className={isScrambling ? styles.masked : undefined}>{text}</span>
      {isScrambling && (
        <span aria-hidden="true" data-decrypt-frame className={styles.frame}>
          {frame}
        </span>
      )}
    </span>
  );
}

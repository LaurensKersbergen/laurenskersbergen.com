"use client";

import { useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/kbd";
import { email } from "@/lib/site";

/**
 * Laurens's address as a quiet pill: the address opens a mail app, and "copy" beside it puts it on
 * the clipboard. "copy" and "copied" share one slot sized to the longer word, so the pill never
 * changes width; the new word rises in as the old one leaves (site.css), and it returns after 2s.
 * C presses it from anywhere on the page (components/keyboard-shortcuts.tsx).
 */
export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <span className="copy-email">
      <a href={`mailto:${email}`} className="copy-email__address">
        {email}
      </a>
      <button
        type="button"
        className="copy-email__button"
        onClick={copy}
        aria-label="Copy email address"
        aria-keyshortcuts="C"
        data-shortcut="c"
        data-copied={copied ? "" : undefined}
      >
        <span className="copy-email__slot">
          <span className="copy-email__label" aria-hidden="true">
            copy
          </span>
          <span className="copy-email__label copy-email__label--done" aria-hidden="true">
            copied
          </span>
        </span>
        <Kbd>c</Kbd>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </span>
  );
}

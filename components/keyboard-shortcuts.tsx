"use client";

import { useEffect } from "react";

/* Typing into something is never a shortcut. */
function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

/**
 * The site's keyboard shortcuts, one letter each, after interfere.com: pressing a key presses the
 * control marked data-shortcut with it (the menu's M, "work with me"'s W, "copy"'s C). The first
 * one that's laid out wins (not display: none, like the phone-only menu row), so a key works
 * wherever its control is, even one still waiting below the fold to fade in. Focus moves to the control
 * first, as if it had been tabbed to, so after M opens the menu Tab carries on into its links.
 * Keys held with ⌘, Ctrl or Alt, held-down repeats and keys typed into a field are left alone.
 * Mounted once in the layout.
 */
export function KeyboardShortcuts() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target) || event.key.length !== 1) return;
      const key = event.key.toLowerCase();
      const controls = [...document.querySelectorAll<HTMLElement>(`[data-shortcut="${CSS.escape(key)}"]`)];
      const control = controls.find((el) => el.checkVisibility({ visibilityProperty: true }) && !el.closest("[inert]"));
      if (!control) return;
      event.preventDefault();
      control.focus({ preventScroll: true });
      control.click();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}

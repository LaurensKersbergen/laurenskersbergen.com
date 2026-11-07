/**
 * A key hint after a button's label, after interfere.com's: the key in a small square that names
 * the shortcut. Hidden from screen readers (the button's aria-keyshortcuts says it) and on touch
 * screens, where there's no keyboard to press it on (site.css).
 */
export function Kbd({ children }: { children: string }) {
  return (
    <kbd className="kbd" aria-hidden="true">
      {children}
    </kbd>
  );
}

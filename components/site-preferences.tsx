"use client";

import { useEffect, useState } from "react";
import { isOn, setOn, type Preference } from "@/lib/preferences";

const switches: { preference: Preference; label: string }[] = [
  { preference: "sounds", label: "sounds" },
  { preference: "shortcuts", label: "keyboard shortcuts" },
];

/**
 * Two quiet switches in the footer: the interface sounds and the one-key shortcuts (M, W, C), both
 * on by default and both easy to turn off, as Apple's guidelines ask of sound and WCAG 2.1.4 of
 * single-key shortcuts. Only for a mouse or trackpad (site.css), where the sounds play and the keys
 * exist. Each is a switch whose name stays put; "on" and "off" are its state.
 */
export function SitePreferences() {
  const [state, setState] = useState<Record<Preference, boolean> | null>(null);

  useEffect(() => {
    setState({ sounds: isOn("sounds"), shortcuts: isOn("shortcuts") });
  }, []);

  if (!state) return null;

  return (
    <div className="site-preferences" role="group" aria-label="Preferences">
      {switches.map(({ preference, label }) => (
        <button
          key={preference}
          type="button"
          role="switch"
          aria-checked={state[preference]}
          className="site-preferences__switch"
          onClick={() => {
            const next = !state[preference];
            setOn(preference, next);
            setState({ ...state, [preference]: next });
          }}
        >
          {label}
          <span aria-hidden className="site-preferences__state">
            {state[preference] ? "on" : "off"}
          </span>
        </button>
      ))}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { playSound, unlockSounds } from "@/lib/ui-sounds";

function interactiveElement(target: EventTarget | null) {
  return target instanceof Element ? target.closest("a[href], button, [role=button]") : null;
}

// Hover and click sounds for links and buttons, on devices with a mouse or
// trackpad. Internal links get the navigate sound, everything else a click.
// Add `data-no-hover-sound` to an element to mute hover sounds inside it.
export function UISounds() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let hovered: Element | null = null;

    function onPointerOver(event: PointerEvent) {
      const element = interactiveElement(event.target);
      if (element && element !== hovered && !element.closest("[data-no-hover-sound]")) {
        playSound("hover");
      }
      hovered = element;
    }

    function onClick(event: MouseEvent) {
      const element = interactiveElement(event.target);
      if (!element) return;
      const isInternal = element instanceof HTMLAnchorElement && element.origin === window.location.origin;
      playSound(isInternal ? "navigate" : "click");
    }

    document.addEventListener("pointerdown", unlockSounds, { capture: true });
    document.addEventListener("keydown", unlockSounds, { capture: true });
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", unlockSounds, { capture: true });
      document.removeEventListener("keydown", unlockSounds, { capture: true });
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}

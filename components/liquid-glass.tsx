"use client";

import { useEffect } from "react";

/* What is glass: the menu (collapsed and open) and "laurens" across from it. */
const TARGETS = ".ui-island, .site-name > .ui-island-pill";
const SVG_NS = "http://www.w3.org/2000/svg";

/* Where the light comes from at rest: the top left, as the angle of a conic gradient (0 is up). */
const REST = 315;
/* How far from a pill's edge a mouse starts to turn its light and brighten its rim. */
const NEAR = 200;

/**
 * Liquid glass's behaviour, for the glass that theme.css draws (.ui-island, .ui-island-pill):
 *
 * - Light. A mouse coming within 200px turns each pill's rim highlight toward it and brightens
 *   it, easing there over about a tenth of a second and back to the top left as it goes.
 * - Press. Pressing (mouse, pen or finger) blooms light under the press point, quickly, and lets
 *   it fade after release.
 * - Bending. In Chromium, the page behind a pill bends as it passes under the rim, as it would
 *   through a thick, rounded slab of glass, and stays true through the flat middle; red, green
 *   and blue bend by slightly different amounts, so a hard edge under the rim gets a faint colour
 *   fringe, as real glass disperses light.
 *
 * The bending is an SVG filter that each pill's CSS backdrop filter runs first (--glass-refract).
 * It moves every backdrop pixel by a displacement map drawn for that pill's size and corners:
 * zero in the middle, then, across a rim a third of the pill's height wide (14px at most), a pull
 * inward along the edge's normal that rises toward the edge. The map is redrawn whenever the pill
 * changes size, so it follows the menu as it springs open. Only Chromium runs an SVG filter as a
 * backdrop filter; Safari and Firefox keep the rest of the glass.
 *
 * The light stays put for people who asked for less motion, and none of it runs for people who
 * asked for less transparency (the glass is solid then).
 */
export function LiquidGlass() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(TARGETS)];
    const calm = window.matchMedia("(prefers-reduced-transparency: reduce)");
    if (!els.length || calm.matches) return;

    const stops = [follow(els), bloom(els)];
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    if (brands?.some((b) => b.brand === "Chromium")) stops.push(refract(els));

    const stop = () => {
      for (const s of stops.splice(0)) s();
    };
    calm.addEventListener("change", stop, { once: true });
    return () => {
      calm.removeEventListener("change", stop);
      stop();
    };
  }, []);

  return null;
}

/** Turns each pill's rim light toward a nearby mouse and brightens it. */
function follow(els: HTMLElement[]) {
  const allowed = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const state = els.map(() => ({ angle: REST, near: 0 }));
  let pointer: { x: number; y: number } | null = null;
  let raf = 0;
  let last = 0;

  const frame = (now: number) => {
    // The first frame's timestamp can come before the moment it was asked for, hence the floor.
    const ease = 1 - Math.exp(-clamp(now - last, 0, 50) / 110);
    last = now;
    let moving = false;
    els.forEach((el, i) => {
      const s = state[i];
      let angle = REST;
      let near = 0;
      if (pointer) {
        const r = el.getBoundingClientRect();
        const ex = Math.max(r.left - pointer.x, 0, pointer.x - r.right);
        const ey = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom);
        near = Math.max(0, 1 - Math.hypot(ex, ey) / NEAR);
        // Toward the pointer from the pill's middle, blended back to the rest angle as it leaves.
        const toward = (Math.atan2(pointer.x - (r.left + r.width / 2), r.top + r.height / 2 - pointer.y) * 180) / Math.PI;
        angle = (REST + shortest(REST, toward) * Math.min(1, near * 2) + 360) % 360;
      }
      const da = shortest(s.angle, angle);
      const dn = near - s.near;
      if (Math.abs(da) < 0.2 && Math.abs(dn) < 0.002) {
        if (s.angle !== angle || s.near !== near) write(el, (s.angle = angle), (s.near = near));
        return;
      }
      moving = true;
      s.angle = (((s.angle + da * ease) % 360) + 360) % 360;
      write(el, s.angle, (s.near += dn * ease));
    });
    raf = moving ? requestAnimationFrame(frame) : 0;
  };
  const kick = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !allowed.matches) return;
    pointer = { x: e.clientX, y: e.clientY };
    kick();
  };
  const away = () => {
    pointer = null;
    kick();
  };
  const out = (e: PointerEvent) => {
    if (!e.relatedTarget) away();
  };

  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerout", out);
  window.addEventListener("blur", away);
  allowed.addEventListener("change", away);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", move);
    document.removeEventListener("pointerout", out);
    window.removeEventListener("blur", away);
    allowed.removeEventListener("change", away);
    for (const el of els) {
      el.style.removeProperty("--glass-light");
      el.style.removeProperty("--glass-near");
    }
  };
}

function write(el: HTMLElement, angle: number, near: number) {
  el.style.setProperty("--glass-light", `${angle.toFixed(1)}deg`);
  el.style.setProperty("--glass-near", near.toFixed(3));
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

/** The signed turn, in degrees, from a to b the short way round. */
function shortest(a: number, b: number) {
  return ((((b - a) % 360) + 540) % 360) - 180;
}

/** Blooms light under a press: up in about 60ms, fading over about 400ms after release. */
function bloom(els: HTMLElement[]) {
  const state = els.map(() => ({ value: 0, target: 0 }));
  let raf = 0;
  let last = 0;

  const frame = (now: number) => {
    const dt = clamp(now - last, 0, 50);
    last = now;
    let moving = false;
    els.forEach((el, i) => {
      const s = state[i];
      if (s.value === s.target) return;
      const k = 1 - Math.exp(-dt / (s.target ? 40 : 150));
      s.value += (s.target - s.value) * k;
      if (Math.abs(s.target - s.value) < 0.004) s.value = s.target;
      else moving = true;
      el.style.setProperty("--glass-press", s.value.toFixed(3));
    });
    raf = moving ? requestAnimationFrame(frame) : 0;
  };
  const kick = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const downs = els.map((el, i) => (e: PointerEvent) => {
    if (e.button !== 0) return;
    // Unscaled coordinates: the press shrinks the pill a little as the bloom lands.
    const r = el.getBoundingClientRect();
    const k = el.offsetWidth / r.width || 1;
    el.style.setProperty("--press-x", `${((e.clientX - r.left) * k).toFixed(1)}px`);
    el.style.setProperty("--press-y", `${((e.clientY - r.top) * k).toFixed(1)}px`);
    state[i].target = 1;
    kick();
  });
  const up = () => {
    for (const s of state) s.target = 0;
    kick();
  };

  els.forEach((el, i) => el.addEventListener("pointerdown", downs[i]));
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  window.addEventListener("blur", up);
  return () => {
    cancelAnimationFrame(raf);
    els.forEach((el, i) => {
      el.removeEventListener("pointerdown", downs[i]);
      for (const p of ["--glass-press", "--press-x", "--press-y"]) el.style.removeProperty(p);
    });
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", up);
    window.removeEventListener("blur", up);
  };
}

/* How much more than green each channel bends: red a little less, blue a little more. */
const DISPERSION = [
  ["R", 0.86, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
  ["G", 1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
  ["B", 1.14, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
] as const;

/** Bends the backdrop under each pill's rim (Chromium only). */
function refract(els: HTMLElement[]) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.pointerEvents = "none";
  document.body.append(svg);

  const canvas = document.createElement("canvas");
  const lenses = new Map<Element, { image: SVGFEImageElement; maps: SVGFEDisplacementMapElement[]; size: string }>();
  const pending = new Set<Element>();
  let raf = 0;

  const draw = (el: HTMLElement) => {
    const lens = lenses.get(el);
    if (!lens) return;
    const w = Math.round(el.offsetWidth);
    const h = Math.round(el.offsetHeight);
    const r = Math.min(Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
    const size = `${w}x${h}x${r}`;
    if (!w || !h || size === lens.size) return;
    lens.size = size;

    // The rim: a third of the pill's height, up to 14px, so the 36px pills bend over their outer
    // 12px and the open menu over 14px, leaving its links on flat glass.
    const rim = Math.min(14, h / 3);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(w, h);
    const cx = w / 2;
    const cy = h / 2;
    const ix = cx - r;
    const iy = cy - r;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const px = x + 0.5 - cx;
        const py = y + 0.5 - cy;
        const qx = Math.abs(px) - ix;
        const qy = Math.abs(py) - iy;
        // Distance in from the rounded edge, and the edge's outward normal there.
        let depth: number;
        let nx: number;
        let ny: number;
        if (qx > 0 && qy > 0) {
          const len = Math.hypot(qx, qy) || 1;
          depth = r - len;
          nx = (qx / len) * Math.sign(px);
          ny = (qy / len) * Math.sign(py);
        } else if (qx > qy) {
          depth = r - qx;
          nx = Math.sign(px);
          ny = 0;
        } else {
          depth = r - qy;
          nx = 0;
          ny = Math.sign(py);
        }
        // A lens's slope: flat inside the rim, then rising toward the edge. Squared rather than a
        // circle's steep wall, which stretched one line under the edge into a thick band.
        const t = Math.min(1, Math.max(0, 1 - depth / rim));
        const pull = t * t;
        const i = (y * w + x) * 4;
        img.data[i] = 128 - nx * pull * 127;
        img.data[i + 1] = 128 - ny * pull * 127;
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    lens.image.setAttribute("href", canvas.toDataURL());
    lens.image.setAttribute("width", String(w));
    lens.image.setAttribute("height", String(h));
    // The very edge shows what lies 0.4 of a rim further in (for green; red and blue either side).
    lens.maps.forEach((map, i) => map.setAttribute("scale", String(rim * 0.8 * DISPERSION[i][1])));
  };

  const flush = () => {
    raf = 0;
    for (const el of pending) draw(el as HTMLElement);
    pending.clear();
  };
  const resized = new ResizeObserver((entries) => {
    for (const entry of entries) pending.add(entry.target);
    if (!raf) raf = requestAnimationFrame(flush);
  });

  els.forEach((el, n) => {
    const id = `liquid-glass-${n}`;
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.id = id;
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", "100%");
    filter.setAttribute("height", "100%");
    filter.setAttribute("color-interpolation-filters", "sRGB");
    const image = document.createElementNS(SVG_NS, "feImage");
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("preserveAspectRatio", "none");
    image.setAttribute("result", "map");
    filter.append(image);
    // Each channel bent on its own, kept to that channel, then added back together.
    const maps = DISPERSION.map(([channel, , matrix]) => {
      const map = document.createElementNS(SVG_NS, "feDisplacementMap");
      map.setAttribute("in", "SourceGraphic");
      map.setAttribute("in2", "map");
      map.setAttribute("xChannelSelector", "R");
      map.setAttribute("yChannelSelector", "G");
      map.setAttribute("result", `bent${channel}`);
      const only = document.createElementNS(SVG_NS, "feColorMatrix");
      only.setAttribute("in", `bent${channel}`);
      only.setAttribute("type", "matrix");
      only.setAttribute("values", matrix);
      only.setAttribute("result", `only${channel}`);
      filter.append(map, only);
      return map;
    });
    const rg = document.createElementNS(SVG_NS, "feBlend");
    rg.setAttribute("in", "onlyR");
    rg.setAttribute("in2", "onlyG");
    rg.setAttribute("mode", "screen");
    rg.setAttribute("result", "rg");
    const rgb = document.createElementNS(SVG_NS, "feBlend");
    rgb.setAttribute("in", "rg");
    rgb.setAttribute("in2", "onlyB");
    rgb.setAttribute("mode", "screen");
    filter.append(rg, rgb);
    svg.append(filter);
    lenses.set(el, { image, maps, size: "" });
    draw(el);
    el.style.setProperty("--glass-refract", `url(#${id})`);
    resized.observe(el);
  });

  return () => {
    cancelAnimationFrame(raf);
    resized.disconnect();
    for (const el of lenses.keys()) (el as HTMLElement).style.removeProperty("--glass-refract");
    svg.remove();
  };
}

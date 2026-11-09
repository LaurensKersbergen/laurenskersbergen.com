/*
 * The visitor's own switches for the site's extras: interface sounds and one-key shortcuts. Each is
 * on unless turned off, kept in localStorage, and mirrored as data-sounds / data-shortcuts="off" on
 * <html>, which the layout's first script sets before paint (preferenceFlags below), so the key
 * hints never flash in for someone who turned shortcuts off.
 */

export type Preference = "sounds" | "shortcuts";

const storageKey = (preference: Preference) => `pref:${preference}`;

export function isOn(preference: Preference) {
  return document.documentElement.getAttribute(`data-${preference}`) !== "off";
}

export function setOn(preference: Preference, on: boolean) {
  const value = on ? "on" : "off";
  document.documentElement.setAttribute(`data-${preference}`, value);
  try {
    localStorage.setItem(storageKey(preference), value);
  } catch {
    // Storage blocked (a private window): the switch still holds for this visit.
  }
}

/** Inline script for <head>: copies stored "off" switches onto <html> before the first paint. */
export const preferenceFlags = `try{for(var p of ["sounds","shortcuts"]){if(localStorage.getItem("pref:"+p)==="off")document.documentElement.setAttribute("data-"+p,"off")}}catch(e){}`;

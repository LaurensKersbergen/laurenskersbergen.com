# Rehearsal: Hori

Gold: `hero-demo` (hero), `opposite-corners` (card), `panel-annotation` (rotation), `fade-crop` (calendar).

Built from the running app (`~/dev/hori`, its `garden-preview.html`): the 3D garden is the app's own render,
captured at 2x with the bed labels blanked (their 52px label canvases draw nothing), so crops never slice a
label; the one label each story needs (`Blok 6 | Blad`) is drawn in the DOM at the position measured from a
labelled twin of the same camera.

Beats:
- Hero: task clicked, camera flies to Blok 6 (one path for both renders, the close one fading in mid-flight),
  panel opens, Gedaan ticks it, the row collapses and the app's toast offers "Ongedaan maken", which brings it
  back; fit returns the camera. Poster: the task picked, its bed in view, the panel open.
- Hero on phones: the bed and the task's panel; Gedaan, the toast, its undo.
- Card: play restarts the season (as in the app) and runs January to August; rest and poster are August.
- Stills: Blok 6's panel where the app puts it, its rotation and its notes (with the add-a-photo tile,
  Hori PR #22; Bemesten left out so the panel fits whole, and on phones its foot too); the cabbages'
  calendar, the whole year inside a pinned card with its foot faded (March to December on phones).

Updated 9 Nov 2026 to the app after Hori PR #25 (one 56px top band with one line under it, 16px left
edge for avatar, tab icons, group labels, ticks and thumbnails, rows ending at the header's buttons,
8px control radius) and PR #26 (13px UI text, 12px small text), measured from garden-preview.html on
the type-scale branch: sidebar, top band, slider, toast, task panel, blok panel and calendar.

Captured: 1280 and 390, light and dark, `--states`, hover, reduced-motion poster.

Gate lines that stand, with why:
- `clipped` / `hard edge` on `.hr-shot` (hero, wide): the renders are a 3D canvas's view and move under the
  app's own sidebar and top bar, which is what the canvas does in the product.
- `uneven gutters` on the rotation's `.hr-panel`: anchored UI where the app anchors it (the canvas's
  bottom-right), not a satellite (framing.md, rule 16).
- `settle snap` 0.5 to 0.8px on the card: the project card's hover scale; not reproduced in a real browser.
- `kit override: .ss-phone__*`: site-wide (the kit's own phone.css and scenes.css's dark screen colour), not Hori.
- `loose stack` on the rotation's year over its crop: the dot and its line sit between them, the app's own
  timeline (year, dot, crop), not a name and its preview.
- `settle snap` 20 to 40px on `.ss-roll__mid` in the card's week label: there before this update too (42px on
  the previous commit), when play restarts the season from August to January.

Review (fresh eye): 17 findings; all fixed except the dark-mode sky (the app's own clear colour, kept as the
app shows it, and far smaller now the card is cropped to the beds).

Not checked: Safari and Firefox (headless Chrome only); motion at under 100ms steps except the camera flight;
the photos themselves (no real photos of the garden yet, so the panel shows the add tile, as the app does
before any are added).

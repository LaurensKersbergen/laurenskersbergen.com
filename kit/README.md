# Starter kit UI (copy)

`kit/ui/` is a copy of part of the starter kit's UI package, imported in this site as `@kit/ui` (a `paths` entry in `tsconfig.json`). The theme is imported by relative path in `app/globals.css`, right after Tailwind.

- **Source:** the starter repo, `packages/ui/src`, at commit `0374e58`.
- **Copied:** `theme.css`, `tokens.css`, `brand.css`, `cn.ts`, `link.tsx`, `list.tsx`, `display.tsx`, `avatar.tsx`, `meta-list.tsx`, `button-class.ts`, `icons.tsx`, `group-label.ts`. These import nothing else from the kit. `index.ts` is the kit's, trimmed to these files.
- **Runtime dependencies they import:** `@base-ui/react`, `clsx`, `tailwind-merge`, `lucide-react`.

Kit code keeps the kit's style (named function exports, `cn()`, tokens, Base UI for interactive parts), so changes can be copied back unchanged. Each change below is marked in its file with a comment saying it is new to the kit.

## This site's brand

`brand.css` is set to this site's look: Geist Sans (loaded by `geist/font/sans` in `app/layout.tsx`), pure greys (neutral chroma 0), a 0.5rem radius, and the site's selection blue `#0066db` as the accent (a lighter blue of the same hue in dark mode). The site's own `--bg`, `--ink`, `--fg`, `--text-copy`, `--muted` and `--border` in `app/globals.css` point at the kit's palette (`--palette-*`) and tokens, and it sets `--media-radius` (16px) for `Media`.

## To copy back to the starter

| Change | Files | Status |
|---|---|---|
| Extension: the brand chooses its font. `theme.css` no longer imports `@fontsource-variable/inter`; `brand.css` sets `--brand-font` and the app (or `brand.css`) loads the font. | `theme.css`, `brand.css` | done |
| Extension: reading-size text token for long-form text (21px on a 34px line, and 19px on 30px below 640px): `--ui-text-prose` and `--ui-text-prose-line-height` in `tokens.css` (with the phone step in a media query), `text-prose` in `theme.css`, `prose` in the `text` group in `cn.ts`. | `tokens.css`, `theme.css`, `cn.ts` | done |
| Extension: spring motion token for size changes: `--ui-ease-spring` (a `linear()` curve from a damped spring with a 0.1 bounce), `--ui-duration-spring` (400ms, opening), `--ui-duration-spring-out` (300ms, closing) and `--ui-spring-stagger` (25ms) in `tokens.css`; `ease-spring`, `duration-spring` and `duration-spring-out` in `theme.css`. | `tokens.css`, `theme.css` | done |
| Extension: reading-size `ListItem` variant without the hover fill: `variant="reading"` sets the row in `text-prose`, lets the title and description wrap, drops the hover fill, underlines the title on hover or keyboard focus, and lines the content up with the surrounding text (the focus ring sits just outside). | `list.tsx` | done |
| Addition: `Island`, the floating menu: a "Menu" pill in the bottom-left corner (36px in, 20px on phones, above the safe area) that grows upward into a panel of links. `startsGroup` on a link draws a hairline above it; once a press opens or pins it, the pill reads `closeLabel` ("Close") and closes it. Its surface and shadow are tokens: `--ui-island` and `--ui-shadow-island` in `tokens.css`, `bg-island` and `shadow-island` in `theme.css`. | `island.tsx`, `tokens.css`, `theme.css` | done |
| Addition: `Media` and `MediaGrid`, images and videos with captions, including the reduced-motion video behaviour. `MediaGrid` takes an optional `onOpen` so the app supplies its own lightbox. The frame's corners follow `--media-radius` when the app sets it, the card radius otherwise. | `media.tsx` | done |
| Addition: `Embed`, a lazy live embed with a link out beneath it. | `embed.tsx` | done |
| Fix to consider: `groupLabelClass` uses `text-ink-3`, which fails WCAG AA contrast at its 12px size on a white background (axe `color-contrast`). This site no longer uses it (the homepage's projects list is gone). | `group-label.ts` | to decide |

Update a row to "done" when the change lands in `kit/ui/`.

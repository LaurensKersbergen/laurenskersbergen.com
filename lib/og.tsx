import fs from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

/** Link previews (Open Graph and X): 1200 by 630, the size every network crops to cleanly. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/* The site's ink and muted text (--palette-950 and --palette-500, as hex for the renderer). */
const INK = "#0a0a0a";
const MUTED = "#737373";

async function asset(...parts: string[]) {
  return fs.readFile(path.join(process.cwd(), ...parts));
}

/**
 * A link preview in the site's own look: white, Geist, the avatar and name in the top-left corner
 * as in the header, a title with a quieter line under it, and the address at the foot. Rendered at
 * build time, so it reads its fonts and avatar from disk.
 */
export async function ogImage({ title, subtitle }: { title: string; subtitle: string }) {
  const [medium, regular, avatar] = await Promise.all([
    asset("node_modules", "geist", "dist", "fonts", "geist-sans", "Geist-Medium.ttf"),
    asset("node_modules", "geist", "dist", "fonts", "geist-sans", "Geist-Regular.ttf"),
    asset("public", "images", "avatar-laurens.jpg"),
  ]);
  const avatarSrc = `data:image/jpeg;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#ffffff", fontFamily: "Geist" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not a page */}
          <img src={avatarSrc} width={56} height={56} alt="" style={{ borderRadius: 999, border: "1px solid rgba(0,0,0,0.08)" }} />
          <div style={{ fontSize: 28, fontWeight: 500, color: INK }}>laurens</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.035em", color: INK }}>{title}</div>
          <div style={{ fontSize: 34, fontWeight: 400, lineHeight: 1.35, letterSpacing: "-0.01em", color: MUTED, maxWidth: 940 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 400, color: MUTED }}>laurenskersbergen.com</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}

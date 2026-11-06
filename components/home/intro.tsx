import Image from "next/image";
import type { CSSProperties } from "react";

function Company({ href, logo, name, index }: { href: string; logo: string; name: string; index: number }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="intro__company">
      <span className="intro__slot" style={{ "--j": index } as CSSProperties}>
        <Image src={logo} alt="" width={64} height={64} className="intro__logo" priority />
      </span>
      <span className="intro__name">{name}</span>
    </a>
  );
}

/**
 * Who Laurens is in two lines, the second quieter. The lines come out of a blur one after the
 * other, then each company's logo opens a slot in its line and blooms into it (site.css).
 */
export function Intro() {
  return (
    <section aria-label="Introduction" className="shell">
      <h1 className="intro">
        <span className="intro__line" style={{ "--i": 0 } as CSSProperties}>
          Laurens Kersbergen, product manager in Amsterdam.
        </span>{" "}
        <span className="intro__line intro__muted" style={{ "--i": 1 } as CSSProperties}>
          {"Databases and AI at "}
          <Company href="https://miro.com/" logo="/logos/miro.png" name="Miro" index={0} />
          {". Before that, growth at "}
          <Company href="https://www.kpn.com/" logo="/logos/kpn.png" name="KPN" index={1} />
          {" and a company of my own."}
        </span>
      </h1>
    </section>
  );
}

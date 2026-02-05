import Link from "next/link";
import { CollabCursor } from "@/components/collab-cursor";

export default function Home() {
  return (
    <div className="mt-16">
      <CollabCursor />
      <h1 className="text-xl md:text-2xl font-medium mb-1" style={{ lineHeight: "3.25rem" }}>Laurens Kersbergen</h1>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"I'm a product manager in Amsterdam, currently working at "}
        <a href="https://miro.com/" target="_blank" rel="noopener noreferrer">Miro</a>
        {" on databases and AI for visual collaboration."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"Before Miro, I founded a B2B SaaS company (learned to build with zero resources), then scaled products to millions at "}
        <a href="https://www.kpn.com/" target="_blank" rel="noopener noreferrer">KPN</a>
        {" (learned enterprise quality). That combination of founder speed and enterprise discipline defines how I work."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"I get energy from technically complex problems that create simple experiences. I believe in craft, sweating details that make products feel right, while moving fast enough to learn. I thrive on small, convicted teams that move fast and think big."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"I live in Amsterdam with my partner, our two-year-old daughter, and cat Dries. You'll find me doing CrossFit, competing in HYROX races, cooking for friends, or pulling god-shot double espressos. Weekends: gaming with friends, building side projects (just shipped a hyper-personalized meal planning app), or skiing if it's winter. Also bit of a biohacker."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        <Link href="/about">More about me</Link>
        {" · "}
        <a href="mailto:hey@laurenskersbergen.com">Reach out</a>
      </p>
    </div>
  );
}

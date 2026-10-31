import Image from "next/image";
import Link from "next/link";
import { LogoLink } from "@/components/logo-link";

// TODO(Laurens): a clay avatar for now; swap public/images/portrait.jpg for a photo when there is one.
const PORTRAIT_SRC = "/images/portrait.jpg";

export default function Home() {
  return (
    // Phones and tablets: the portrait above the text in the 680px column. From 900px: portrait and
    // text side by side in an 850px block, centred in the window.
    <div className="mx-auto box-content max-w-[42.5rem] px-6 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-24 min-[900px]:flex min-[900px]:min-h-svh min-[900px]:max-w-[53.125rem] min-[900px]:items-center min-[900px]:py-30">
      <div className="enter min-[900px]:flex min-[900px]:items-start min-[900px]:gap-16">
        <Image
          src={PORTRAIT_SRC}
          alt="Laurens Kersbergen"
          width={300}
          height={300}
          priority
          className="mb-8 size-45 shrink-0 rounded-2xl object-cover min-[900px]:mb-0 min-[900px]:size-75 min-[900px]:rounded-3xl"
        />
        <div className="enter min-w-0 text-(--muted) [--enter-start:1] min-[900px]:w-[30.375rem]">
          <h1 className="text-name mb-7">Laurens Kersbergen</h1>
          <p className="mb-7">
            {"I'm a product manager in Amsterdam, currently working at "}
            <LogoLink href="https://miro.com/" logo="/logos/miro.png">Miro</LogoLink>
            {" on databases and AI for visual collaboration."}
          </p>
          <p className="mb-7">
            {"Before Miro, I founded a B2B SaaS company (learned to build with zero resources), then scaled products to millions at "}
            <LogoLink href="https://www.kpn.com/" logo="/logos/kpn.png">KPN</LogoLink>
            {" (learned enterprise quality). That combination of founder speed and enterprise discipline defines how I work."}
          </p>
          <p className="mb-7">
            {"I get energy from technically complex problems that create simple experiences. I believe in craft, sweating details that make products feel right, while moving fast enough to learn. I thrive on small, convicted teams that move fast and think big."}
          </p>
          <p className="mb-7">
            {"I live in Amsterdam with my partner, our two-year-old daughter, and cat Dries. You'll find me doing CrossFit, competing in HYROX races, cooking for friends, or pulling god-shot double espressos. Weekends: gaming with friends, building side projects ("}
            <Link href="/projects/meal-planner">just shipped a hyper-personalized meal planning app</Link>
            {"), or skiing if it's winter. Also bit of a biohacker."}
          </p>
          <p className="flex flex-wrap gap-x-6">
            <Link href="/about">About</Link>
            <a href="mailto:hey@laurenskersbergen.com">Email</a>
          </p>
        </div>
      </div>
    </div>
  );
}

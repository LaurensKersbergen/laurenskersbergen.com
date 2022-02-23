import Link from "next/link"
import { ComponentProps } from "react"
import Button from "../button"

/**
 * An introduction section with a short bio.
 *
 * @param props - A set of `section` props.
 */
export function Introduction(props: ComponentProps<"section">) {
  return (
    <section {...props}>
      <div className="space-y-7 text-lg font-normal leading-8 text-neutral-700 dark:text-neutral-400">
        <p>
          Hey, I’m Laurens — a product manager living in Amsterdam. I currently
          work at{" "}
          <a
            className="focusable rounded-sm text-blue-600 underline-offset-2 transition duration-100 hover:underline focus:text-sky-500"
            href="https://www.miro.com/"
            rel="noreferrer"
            target="_blank"
          >
            Miro
          </a>
          , focusing on building a best-in-class marketing website.
        </p>

        <p>
          Previously, I worked on the initial release of{" "}
          <a
            className="focusable rounded-sm text-blue-600 underline-offset-2 transition duration-100 hover:underline focus:text-sky-500"
            href="https://www.growthtribe.io/"
            rel="noreferrer"
            target="_blank"
          >
            Growth Tribe
          </a>
          ’s learning platform. Before that, I improved high-traffic websites at{" "}
          <a
            className="focusable rounded-sm text-blue-600 underline-offset-2 transition duration-100 hover:underline focus:text-sky-500"
            href="https://www.kpn.com/"
            rel="noreferrer"
            target="_blank"
          >
            KPN.com
          </a>{" "}
          and{" "}
          <a
            className="focusable rounded-sm text-blue-600 underline-offset-2 transition duration-100 hover:underline focus:text-sky-500"
            href="https://fitchannel.com/"
            rel="noreferrer"
            target="_blank"
          >
            Fitchannel.com
          </a>
          .
        </p>

        <p>
          After hours, I flip through design and art books, prepare god-shot
          espressos, and thruster with friends at our favorite CrossFit box.
        </p>
        <div className="flex flex-col space-y-3 md:flex-row md:space-x-4 md:space-y-0">
          <Link href="/about" passHref>
            <a>
              <Button className="block w-full">Learn more about me</Button>
            </a>
          </Link>
          <a
            href="https://www.polywork.com/laurens"
            rel="noreferrer"
            target="_blank"
          >
            <Button className="block w-full">
              View changelog &nbsp;&#8599;
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

import { ComponentProps } from "react"

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
      </div>
    </section>
  )
}

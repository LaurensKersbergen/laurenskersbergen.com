import { ComponentProps } from "react"

/**
 * An introduction section with a short bio.
 *
 * @param props - A set of `section` props.
 */
export function Introduction(props: ComponentProps<"section">) {
  return (
    <section {...props}>
      <div className="space-y-7 font-normal leading-7 text-neutral-700 dark:text-neutral-400">
        <p>
          Hey, I’m Laurens – a product manager living in Amsterdam. I care about
          form and function and believe in the power of simplicity. I’m
          currently building websites at{" "}
          <a
            className="focusable rounded-sm text-blue-600 underline-offset-2 transition duration-100 hover:underline focus:text-sky-500"
            href="https://www.miro.com/"
            rel="noreferrer"
            target="_blank"
          >
            Miro
          </a>
          .
        </p>

        <p>
          Previously, I worked on the initial release of a learning platform at{" "}
          <a
            className="focusable rounded-sm text-blue-600 underline-offset-2 transition duration-100 hover:underline focus:text-sky-500"
            href="https://www.growthtribe.io/"
            rel="noreferrer"
            target="_blank"
          >
            Growth Tribe
          </a>
          . Before that, I focused on improving high-traffic websites at{" "}
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
          I flip through design and art books in my free time, pull god-shot
          espressos at home, and do CrossFit.
        </p>
      </div>
    </section>
  )
}

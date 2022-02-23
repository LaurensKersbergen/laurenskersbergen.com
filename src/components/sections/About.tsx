import Image from "next/image"
import { ComponentProps } from "react"
import photo from "../../../public/laurenskersbergen.jpg"

const linkClass =
  "focusable rounded-sm text-blue-600 text-blue-600 underline-offset-2 transition duration-100 hover:underline focus:text-sky-500"

/**
 * An introduction section with a short bio.
 *
 * @param props - A set of `section` props.
 */
export function About(props: ComponentProps<"section">) {
  return (
    <section {...props}>
      <div>
        <div>
          <Image
            alt="Laurens Kersbergen at work"
            className="w-full overflow-hidden rounded-lg object-cover"
            height="460"
            priority
            src={photo}
            width="728"
          />
        </div>
      </div>
      <div className="mt-10">
        <p className="my-4 leading-7 text-neutral-700 dark:text-neutral-400">
          Hey, I’m Laurens — a product manager with +5 years of experience
          living in Amsterdam. I’m drawn to modern technology teams working on
          complex and meaningful issues. I currently work at{" "}
          <a
            className={linkClass}
            href="https://www.miro.com/"
            rel="noreferrer"
            target="_blank"
          >
            Miro
          </a>
          , building a best-in-class marketing website.
        </p>
        <p className="my-4 leading-7 text-neutral-700 dark:text-neutral-400">
          Previously, I worked on the initial release of{" "}
          <a
            className={linkClass}
            href="https://www.growthtribe.io/"
            rel="noreferrer"
            target="_blank"
          >
            Growth Tribe
          </a>
          ’s learning platform. The platform makes learning personalized,
          collaborative, and impactful.
        </p>

        <p className="my-4 leading-7 text-neutral-700 dark:text-neutral-400">
          Before that, as part of the site team, I worked on many aspects of{" "}
          <a
            className={linkClass}
            href="https://www.kpn.com/"
            rel="noreferrer"
            target="_blank"
          >
            KPN.com
          </a>
          . From improving the check-out experience to building email
          notifications and dynamic landing pages.
        </p>

        <p className="my-4 leading-7 text-neutral-700 dark:text-neutral-400">
          In 2017, I was part of the early team at{" "}
          <a
            className={linkClass}
            href="https://www.fitchannel.com/"
            rel="noreferrer"
            target="_blank"
          >
            Fitchannel.com
          </a>
          , where I built a subscription-based online fitness platform targeting
          people who want to get stronger, eat healthier, or lose weight.
        </p>

        <p className="my-4 leading-7 text-neutral-700 dark:text-neutral-400">
          I’m always interested in new ideas and perspectives. Feel free to drop
          me a note. You can find me on{" "}
          <a
            className={linkClass}
            href="https://twitter.com/lvkersbergen/"
            rel="noreferrer"
            target="_blank"
          >
            Twitter
          </a>
          , where I talk about Product, Design, and Development, or on{" "}
          <a
            className={linkClass}
            href="https://github.com/LaurensKersbergen/"
            rel="noreferrer"
            target="_blank"
          >
            Github
          </a>
          , where I code in the open.
        </p>
      </div>
    </section>
  )
}

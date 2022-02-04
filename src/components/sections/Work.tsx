import Link from "next/link"
import { ComponentProps } from "react"

/**
 * A Safari-like browser window.
 *
 * @param props - A set of `div` props.
 * @param [props.url] - The browser's current URL.
 * @param [props.children] - The browser's content.
 * @param [props.className] - A list of one or more classes.
 */

/**
 * An iPhone-like device.
 *
 * @param props - A set of `div` props.
 * @param [props.children] - The browser's content.
 * @param [props.className] - A list of one or more classes.
 */

/**
 * A section displaying my latest listens and watches.
 *
 * @param props - A set of `section` props.
 */
export function Work(props: ComponentProps<"section">) {
  return (
    <section {...props}>
      <div className="content mb-8">
        <h2 className="mb-2 text-xl font-bold text-zinc-800 dark:text-white">
          Writing
        </h2>
        <p className="max-w-[46ch] leading-relaxed text-zinc-500 dark:text-zinc-350">
          Thinking out loud about product management and design.
        </p>

        <Link href="/writing">
          <a className="mt-8 flex h-6 rounded-lg leading-6 text-zinc-800 dark:text-white">
            Read all posts
            <svg
              className="ml-1 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 12h-15m11.667-4l3.333 4-3.333-4zm3.333 4l-3.333 4 3.333-4z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </a>
        </Link>
      </div>
      <div className="content mt-12 sm:mt-24">
        <h2 className="mb-2 text-xl font-bold text-zinc-800 dark:text-white">
          Work
        </h2>
        <p className="max-w-[46ch] leading-relaxed text-zinc-500 dark:text-zinc-350">
          A list of places I worked.
        </p>
        <ul className="text-sm">
          <li className="my-5 flex items-center gap-4 text-zinc-500 dark:text-zinc-350">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.miro.com/"
              rel="noreferrer"
              target="_blank"
            >
              Miro
            </a>
            <span className="truncate">Product Manager, Website</span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap font-medium">
              <span className="inline-block w-10 text-center">2022</span>
              <span className="text-zinc-300 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center" />
            </span>
          </li>
          <li className="my-5 flex items-center gap-4 text-zinc-500 dark:text-zinc-350">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.growthtribe.io/"
              rel="noreferrer"
              target="_blank"
            >
              Growth Tribe
            </a>
            <span className="truncate">Product Manager</span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap font-medium">
              <span className="inline-block w-10 text-center">2021</span>
              <span className="text-zinc-300 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center">2022</span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4 text-zinc-500 dark:text-zinc-350">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.kpn.com/"
              rel="noreferrer"
              target="_blank"
            >
              KPN.com
            </a>
            <span className="truncate">Product Manager, Growth</span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap font-medium">
              <span className="inline-block w-10 text-center">2019</span>
              <span className="text-zinc-300 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center">2021</span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4 text-zinc-500 dark:text-zinc-350">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.kpn.com/"
              rel="noreferrer"
              target="_blank"
            >
              KPN.com
            </a>
            <span className="truncate">Marketing Manager</span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap font-medium">
              <span className="inline-block w-10 text-center">2018</span>
              <span className="text-zinc-300 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center">2019</span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4 text-zinc-500 dark:text-zinc-350">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.vinla.nl/"
              rel="noreferrer"
              target="_blank"
            >
              Vinla
            </a>
            <span className="truncate">Founder & Owner</span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap font-medium">
              <span className="inline-block w-10 text-center">2011</span>
              <span className="text-zinc-300 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center">2018</span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

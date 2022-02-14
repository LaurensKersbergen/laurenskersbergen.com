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
      <div className="content mt-12 sm:mt-24">
        <h2 className="mb-2 text-xl">Work</h2>
        <ul>
          <li className="my-5 flex items-center gap-4">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.miro.com/"
              rel="noreferrer"
              target="_blank"
            >
              Miro
            </a>
            <span className="truncate text-neutral-400">
              Product Manager, Website
            </span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-500">
                2022
              </span>
              <span className="text-neutral-500 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center" />
            </span>
          </li>
          <li className="my-5 flex items-center gap-4">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.growthtribe.io/"
              rel="noreferrer"
              target="_blank"
            >
              Growth Tribe
            </a>
            <span className="truncate text-neutral-400">Product Manager</span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-500">
                2021
              </span>
              <span className="text-neutral-500 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center text-neutral-500">
                2022
              </span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.kpn.com/"
              rel="noreferrer"
              target="_blank"
            >
              KPN.com
            </a>
            <span className="truncate text-neutral-400">
              Product Manager, Growth
            </span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-500">
                2019
              </span>
              <span className="text-neutral-500 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center text-neutral-500">
                2021
              </span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.kpn.com/"
              rel="noreferrer"
              target="_blank"
            >
              KPN.com
            </a>
            <span className="truncate text-neutral-400">Marketing Manager</span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-500">
                2018
              </span>
              <span className=" text-neutral-500 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center text-neutral-500">
                2019
              </span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4">
            <a
              className="link focusable font-medium text-zinc-800 dark:text-white"
              href="https://www.vinla.nl/"
              rel="noreferrer"
              target="_blank"
            >
              Vinla
            </a>
            <span className="truncate text-neutral-400">Founder & Owner</span>
            <span className="wave flex-1" />
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-500">
                2011
              </span>
              <span className="text-neutral-400 dark:text-zinc-500">—</span>
              <span className="inline-block w-10 text-center text-neutral-500">
                2018
              </span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

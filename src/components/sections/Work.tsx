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
              className="font-medium text-zinc-800 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-600"
              href="https://www.miro.com/"
              rel="noreferrer"
              target="_blank"
            >
              Miro
            </a>
            <span className="wave flex-1" />
            <span className="truncate text-neutral-500">
              Product Manager, Website
            </span>
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-400">
                2022
              </span>
              <span className="text-neutral-400 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center" />
            </span>
          </li>
          <li className="my-5 flex items-center gap-4">
            <a
              className="font-medium text-zinc-800 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-600"
              href="https://www.growthtribe.io/"
              rel="noreferrer"
              target="_blank"
            >
              Growth Tribe
            </a>
            <span className="wave flex-1" />
            <span className="truncate text-neutral-500">Product Manager</span>
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-400">
                2021
              </span>
              <span className="text-neutral-400 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center text-neutral-400">
                2022
              </span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4">
            <a
              className="font-medium text-zinc-800 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-600"
              href="https://www.kpn.com/"
              rel="noreferrer"
              target="_blank"
            >
              KPN.com
            </a>
            <span className="wave flex-1" />
            <span className="truncate text-neutral-500">
              Product Manager, Growth
            </span>
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-400">
                2019
              </span>
              <span className="text-neutral-400 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center text-neutral-400">
                2021
              </span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4">
            <a
              className="font-medium text-zinc-800 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-600"
              href="https://www.kpn.com/"
              rel="noreferrer"
              target="_blank"
            >
              KPN.com
            </a>
            <span className="wave flex-1" />
            <span className="truncate text-neutral-500">Marketing Manager</span>
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-400">
                2018
              </span>
              <span className=" text-neutral-400 dark:text-zinc-550">—</span>
              <span className="inline-block w-10 text-center text-neutral-400">
                2019
              </span>
            </span>
          </li>
          <li className="my-5 flex items-center gap-4">
            <a
              className="font-medium text-zinc-800 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-600"
              href="https://www.vinla.nl/"
              rel="noreferrer"
              target="_blank"
            >
              Vinla
            </a>
            <span className="wave flex-1" />
            <span className="truncate text-neutral-500">Founder & Owner</span>
            <span className="-mr-1 whitespace-nowrap">
              <span className="inline-block w-10 text-center text-neutral-400">
                2011
              </span>
              <span className="text-neutral-400 dark:text-zinc-500">—</span>
              <span className="inline-block w-10 text-center text-neutral-400">
                2018
              </span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

import clsx from "clsx"
import { Transition, Variants, m as motion } from "framer-motion"
import { useRouter } from "next/router"
import { ComponentProps } from "react"
import { useSystemTheme } from "../../hooks/use-system-theme"
import { springiest } from "../../transitions"

const themeTransition: Transition = {
  default: springiest,
  opacity: {
    type: "spring",
    duration: springiest.duration - springiest.duration / 2,
    bounce: 0
  }
}

const themeVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      ...themeTransition,
      delay: springiest.duration / 2
    }
  }
}

const navbar = [
  {
    text: "Home",
    href: "/"
  },
  {
    text: "Writing",
    href: "/writing"
  },
  {
    text: "About",
    href: "/about"
  }
]

function ActiveLink({
  children,
  href
}: {
  /**
   *
   */
  children: any
  /**
   *
   */
  href: any
}): JSX.Element {
  const router = useRouter()

  const handleClick = (e: any) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a
      className={`${
        router.asPath === href
          ? "bg-zinc-850 font-semibold text-white dark:bg-dark-3 dark:text-white"
          : "text-zinc-500 hover:bg-light dark:text-light-350 dark:hover:bg-dark-3 dark:hover:text-white"
      } inline-block rounded-full px-3 py-9.5 font-medium leading-none md:mx-1 md:px-4`}
      href={href}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

/**
 * A header section.
 *
 * @param props - A set of `header` props.
 * @param [props.className] - A list of one or more classes.
 */
export function Header({ className, ...props }: ComponentProps<"header">) {
  const [theme, toggleTheme] = useSystemTheme()

  return (
    <header
      className="border-b border-dark border-opacity-10 bg-white py-4 dark:border-light dark:border-opacity-20 dark:bg-dark-1 lg:py-2.5"
      {...props}
    >
      <div className={clsx(className)}>
        <div className="flex items-center text-zinc-700 dark:text-zinc-100">
          <div className="mx-auto text-sm">
            <nav>
              {navbar.map((i, idx) => (
                <ActiveLink href={i.href} key={idx}>
                  {i.text}
                </ActiveLink>
              ))}
            </nav>
          </div>
          <div className="hidden">
            <button
              aria-label="Toggle Theme"
              className="focusable rounded-md bg-transparent p-1.5 transition hover:bg-zinc-500/10 dark:hover:bg-zinc-400/20"
              onClick={toggleTheme}
            >
              <svg
                className="flex-none transition-colors"
                height="24"
                role="presentation"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.g
                  animate={theme === "light" ? "visible" : "hidden"}
                  fill="currentColor"
                  initial="hidden"
                  transition={themeTransition}
                  variants={themeVariants}
                >
                  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                  <path
                    clipRule="evenodd"
                    d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1ZM19.071 4.929a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.415-1.414l1.415-1.414a1 1 0 0 1 1.414 0ZM16.243 16.243a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 1 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414ZM7.757 16.243a1 1 0 0 1 0 1.414L6.343 19.07a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0ZM4.929 4.929a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 1 1-1.414 1.414L4.93 6.343a1 1 0 0 1 0-1.414ZM12 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM18 12a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1ZM2 12a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1Z"
                    fillRule="evenodd"
                  />
                </motion.g>
                <motion.path
                  animate={theme === "dark" ? "visible" : "hidden"}
                  clipRule="evenodd"
                  d="M18.846 13.396c.473-.212 1.053.141.92.642a8.018 8.018 0 0 1-13.418 3.614A8.017 8.017 0 0 1 9.962 4.234c.5-.133.854.447.642.92a6.236 6.236 0 0 0 8.242 8.242Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  initial="hidden"
                  transition={themeTransition}
                  variants={themeVariants}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

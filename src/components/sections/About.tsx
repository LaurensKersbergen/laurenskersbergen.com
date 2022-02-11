import Image from "next/image"
import { ComponentProps } from "react"
import photo from "../../../public/laurenskersbergen.jpg"

const linkClass =
  "focusable decoration rounded-sm text-blue-500 underline-offset-2 transition duration-100 hover:underline focus:text-sky-500 focus:ring-sky-500/40 dark:text-blue-400 dark:decoration-sky-400 dark:hover:text-sky-400 dark:focus:text-sky-400 dark:focus:ring-sky-400/40"

/**
 * An introduction section with a short bio.
 *
 * @param props - A set of `section` props.
 */
export function About(props: ComponentProps<"section">) {
  return (
    <section {...props}>
      <div className="text-zinc-850 dark:text-zinc-150">
        <div className="">
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
      <div className="mt-10 text-zinc-850 dark:text-zinc-150">
        <p className="my-4 leading-loose">
          Hey, I’m Laurens. I’m a product manager, writer, and{" "}
          <a className={linkClass} href="" rel="noreferrer" target="_blank">
            software tinkerer
          </a>
          . I’m currently building wesbites at{" "}
          <a
            className={linkClass}
            href="https://www.miro.com/"
            rel="noreferrer"
            target="_blank"
          >
            Miro
          </a>
          .
        </p>
        <h2 className="mb-2 text-xl font-bold text-zinc-800 dark:text-white">
          Escaping the meta of product design
        </h2>
        <p className="my-4 leading-loose">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry’s standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
    </section>
  )
}

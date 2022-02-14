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
        <h2 className="mb-2 text-xl">Escaping the meta of product design</h2>
        <p className="my-4 leading-7 text-neutral-700 dark:text-neutral-400">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry’s standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
    </section>
  )
}

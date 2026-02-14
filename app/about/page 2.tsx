import type { Metadata } from "next";
import { ImageGallery } from "@/components/image-gallery";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Laurens Kersbergen — product manager in Amsterdam.",
};

export default function AboutPage() {
  return (
    <div className="mt-16">
      <h1
        className="text-xl md:text-2xl font-medium mb-1"
        style={{ lineHeight: "3.25rem" }}
      >
        About me
      </h1>

      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {
          "I'm Laurens Kersbergen, a product manager living in Amsterdam. I currently work at Miro, where I focus on databases and AI for visual collaboration."
        }
      </p>

      <ImageGallery
        images={[
          { src: "/images/placeholder-1.svg", alt: "Laurens Kersbergen" },
          { src: "/images/placeholder-2.svg", alt: "Laurens at work" },
        ]}
      />

      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {
          "Before Miro, I founded a B2B SaaS company where I learned to build products with extreme constraints and no playbook. After that, I scaled products to millions of users at KPN, learning how to ship at enterprise quality."
        }
      </p>

      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {
          "As a product manager, I get energy from solving technically complex problems that create simple user experiences. I believe in the importance of craft, sweating the details that make products feel right, while moving fast enough to learn."
        }
      </p>

      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {
          "I live in Amsterdam with my partner, our two-year-old daughter, and our cat Dries. In my free time, you can find me doing CrossFit, competing in HYROX races, or cooking for friends. I'm also down the barista rabbit hole, pulling god-shot double espressos every morning."
        }
      </p>

      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"Feel free to "}
        <a href="mailto:hey@laurenskersbergen.com">reach out</a>
        {" if you want to chat about product, collaboration tools, or 0\u21921 development."}
      </p>
    </div>
  );
}

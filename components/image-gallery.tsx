"use client";

import Image, { StaticImageData } from "next/image";
import { useState, useCallback, useEffect, type ComponentProps } from "react";
import { MediaGrid, type MediaImage } from "@kit/ui";

interface GalleryImage {
  src: string | StaticImageData;
  alt: string;
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const cols = images.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";

  return (
    <>
      <div
        className={`relative block w-full md:left-1/2 md:-translate-x-1/2 md:w-screen my-8 md:my-16 grid ${cols} gap-4`}
        style={{ maxWidth: 1100 }}
        data-no-hover-sound
      >
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="relative aspect-[3/2] w-full overflow-hidden rounded-lg cursor-zoom-in border-0 p-0 bg-transparent"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 550px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && <Lightbox image={images[lightboxIndex]} onClose={closeLightbox} />}
    </>
  );
}

/** The photo shown large over the page; a click anywhere or Escape closes it. */
export function Lightbox({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-zoom-out"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
      onClick={onClose}
    >
      <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" priority />
      </div>
    </div>
  );
}

/** The kit's MediaGrid with its images opening in the Lightbox, for project write-ups. */
export function LightboxMediaGrid(props: Omit<ComponentProps<typeof MediaGrid>, "onOpen">) {
  const [image, setImage] = useState<MediaImage | null>(null);
  const close = useCallback(() => setImage(null), []);

  return (
    <>
      <MediaGrid {...props} onOpen={setImage} />
      {image && <Lightbox image={image} onClose={close} />}
    </>
  );
}

"use client";

import Image, { StaticImageData } from "next/image";
import { useState, useCallback, useEffect } from "react";

interface GalleryImage {
  src: string | StaticImageData;
  alt: string;
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox]);

  const cols = images.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";

  return (
    <>
      <div
        className={`relative block w-full md:left-1/2 md:-translate-x-1/2 md:w-screen my-8 md:my-16 grid ${cols} gap-4`}
        style={{ maxWidth: 1100 }}
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

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-zoom-out"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
          onClick={closeLightbox}
        >
          <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center">
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}

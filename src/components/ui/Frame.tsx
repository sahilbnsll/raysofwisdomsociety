import Image from "next/image";
import type { Photo } from "@/content/event";

/**
 * A photograph in a fixed-ratio frame (no layout shift), optionally cut as a temple arch.
 * Photographer credits are listed once in the footer rather than printed on the pictures.
 */
export function Frame({
  photo,
  ratio,
  sizes,
  arch = false,
  priority = false,
  className = "",
}: {
  photo: Photo;
  ratio: string; // e.g. "4 / 5"
  sizes: string;
  arch?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={`relative isolate overflow-hidden bg-sage-deep ${arch ? "arch" : "rounded-2xl"} ${className}`} style={{ aspectRatio: ratio }}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.w}
        height={photo.h}
        sizes={sizes}
        priority={priority}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: photo.position ?? "50% 50%" }}
      />
    </figure>
  );
}

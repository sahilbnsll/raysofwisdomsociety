import Image from "next/image";
import type { Artist } from "@/content/event";

/** A small round portrait from the artist's own photograph. Callers show nothing when there is no photo. */
export function Avatar({ artist, size = "size-12" }: { artist: Artist; size?: string }) {
  const photo = artist.thumb ?? artist.photo;
  if (!photo) return null;
  return (
    <span className={`relative block ${size} shrink-0 overflow-hidden rounded-full bg-sage-deep ring-2 ring-paper`}>
      <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: photo.position ?? "50% 30%" }} />
    </span>
  );
}

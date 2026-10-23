import Image from "next/image";
import type { Artist } from "@/content/event";

export const initials = (name: string) =>
  name
    .replace(/^(Pandit|Dr\.)\s+/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/** A small round portrait: the artist's head-and-shoulders picture, or their initials when we have none. */
export function Avatar({ artist, size = "size-12" }: { artist: Artist; size?: string }) {
  const photo = artist.thumb ?? artist.photo;
  return photo ? (
    <span className={`relative block ${size} shrink-0 overflow-hidden rounded-full bg-sage-deep ring-2 ring-paper`}>
      <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: photo.position ?? "50% 30%" }} />
    </span>
  ) : (
    <span aria-hidden="true" className={`display grid ${size} shrink-0 place-items-center rounded-full bg-sage text-base text-olive ring-2 ring-paper`}>
      {initials(artist.name)}
    </span>
  );
}

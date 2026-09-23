import Image from "next/image";
import type { Result } from "@/lib/results";

// The certificate/screenshot images carry their own dark-green (or, for CEFR, cream) background,
// so framing them in a matching tint lets the card edge disappear into the artwork.
const FRAME_BG: Record<Result["category"], string> = {
  featured: "",
  ielts: "bg-brand",
  olympiad: "bg-brand",
  sat: "bg-brand",
  cefr: "bg-tint-b",
};

export function ResultCard({ result, alt, priority = false }: { result: Result; alt: string; priority?: boolean }) {
  if (result.category === "featured") {
    return (
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[26px] bg-paper">
        <Image
          draggable={false}
          src={result.file}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 46vw, 92vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  return (
    <div className={`group relative aspect-square overflow-hidden rounded-[20px] p-3 sm:p-4 ${FRAME_BG[result.category]}`}>
      <div className="relative h-full w-full">
        <Image
          draggable={false}
          src={result.file}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 32vw, 46vw"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    </div>
  );
}

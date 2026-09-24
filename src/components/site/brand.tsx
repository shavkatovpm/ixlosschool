import Image from "next/image";

const sizes = {
  header: {
    // Desktop sizes are 80% of the original (64/52px crest, 27px wordmark, 11px "School", 14px gap).
    crest: "h-10 min-[1200px]:h-[51px] min-[1200px]:group-data-[scrolled=true]:h-[42px]",
    word: "text-[18px] min-[1200px]:text-[21.6px]",
    sub: "text-[8px] min-[1200px]:text-[8.8px]",
    gap: "gap-2 min-[1200px]:gap-[11.2px]",
    wrap: "flex",
  },
  footer: {
    crest: "h-16 sm:h-20",
    word: "text-[28px] sm:text-[34px]",
    sub: "text-[12px] sm:text-[14px]",
    gap: "gap-4",
    wrap: "flex",
  },
} as const;

export function Brand({ variant }: { variant: keyof typeof sizes }) {
  const s = sizes[variant];
  return (
    <span className={`flex items-center ${s.gap}`}>
      <Image
        src="/brand/ixlos-school-crest.svg"
        width={88}
        height={80}
        alt=""
        priority={variant === "header"}
        className={`w-auto shrink-0 transition-[height] duration-300 ${s.crest}`}
      />
      <span className={`${s.wrap} flex-col leading-none`}>
          <span className={`font-logo font-medium uppercase tracking-[0.3em] ${s.word}`}>Ixlos</span>
          <span className={`mt-[0.5em] font-display font-extrabold uppercase tracking-[0.62em] ${s.sub}`}>School</span>
      </span>
    </span>
  );
}

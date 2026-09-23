import Image from "next/image";

const sizes = {
  header: {
    crest: "h-10 min-[1200px]:h-[64px] min-[1200px]:group-data-[scrolled=true]:h-[52px]",
    word: "text-[18px] min-[1200px]:text-[27px]",
    sub: "text-[8px] min-[1200px]:text-[11px]",
    gap: "gap-2 min-[1200px]:gap-3.5",
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

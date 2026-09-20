import Image from "next/image";

const sizes = {
  header: {
    crest: "h-12 group-data-[scrolled=true]:h-11 sm:h-[64px] sm:group-data-[scrolled=true]:h-[52px]",
    word: "text-[21px] sm:text-[27px]",
    sub: "text-[9px] sm:text-[11px]",
    gap: "gap-2.5 sm:gap-3.5",
    wrap: "hidden min-[380px]:flex",
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

import { useId } from "react";

type FlagProps = { locale: string; className?: string };

function UzFlag() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden className="h-full w-full">
      <rect width="30" height="6.4" fill="#0099B5" />
      <rect y="6.4" width="30" height="7.2" fill="#fff" />
      <rect y="13.6" width="30" height="6.4" fill="#1EB53A" />
      <rect y="6.1" width="30" height="0.7" fill="#CE1126" />
      <rect y="13.2" width="30" height="0.7" fill="#CE1126" />
      <circle cx="6.2" cy="3.3" r="2.35" fill="#fff" />
      <circle cx="7.1" cy="3.3" r="2.05" fill="#0099B5" />
      {[
        [10.2, 1.6],
        [12.4, 1.6],
        [14.6, 1.6],
        [9.1, 3.5],
        [11.3, 3.5],
        [13.5, 3.5],
        [10.2, 5.2],
        [12.4, 5.2],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.55" fill="#fff" />
      ))}
    </svg>
  );
}

function RuFlag() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden className="h-full w-full">
      <rect width="30" height="6.67" fill="#fff" />
      <rect y="6.67" width="30" height="6.67" fill="#0039A6" />
      <rect y="13.33" width="30" height="6.67" fill="#D52B1E" />
    </svg>
  );
}

function GbFlag() {
  const id = useId();
  const clip = `${id}-c`;
  const cross = `${id}-x`;
  return (
    <svg viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" aria-hidden className="h-full w-full">
      <clipPath id={clip}>
        <path d="M0,0 h60 v40 h-60 z" />
      </clipPath>
      <clipPath id={cross}>
        <path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <path d="M0,0 h60 v40 h-60 z" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" clipPath={`url(#${cross})`} stroke="#C8102E" strokeWidth="5" />
        <path d="M30,0 v40 M0,20 h60" stroke="#fff" strokeWidth="13" />
        <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="8" />
      </g>
    </svg>
  );
}

export function Flag({ locale, className = "" }: FlagProps) {
  return (
    <span
      className={`relative inline-block h-[18px] w-[26px] shrink-0 overflow-hidden rounded-[4px] shadow-[0_0_0_1px_rgba(23,60,36,0.18)] ${className}`}
    >
      {locale === "uz" ? <UzFlag /> : locale === "ru" ? <RuFlag /> : <GbFlag />}
    </span>
  );
}

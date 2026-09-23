import { Reveal } from "./reveal";

export function SectionHead({
  index,
  label,
  children,
  className = "",
}: {
  index?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <span className="eyebrow text-khaki-deep">
        {index ? (
          <>
            <span className="text-moss">{index}</span>
            <span aria-hidden className="h-px w-10 bg-current opacity-35" />
          </>
        ) : null}
        {label}
      </span>
      <h2 className="section-title mt-6 max-w-3xl">{children}</h2>
    </Reveal>
  );
}

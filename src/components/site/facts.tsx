import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";

export function Facts() {
  const t = useTranslations();
  const items = t.raw("facts") as { value: string; label: string }[];

  return (
    <div className="wrap pt-16 sm:pt-20">
      <dl className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 90}
            className={`flex flex-col-reverse gap-2 py-8 pl-4 pr-2 sm:py-10 sm:pl-8 sm:pr-4 ${i === 0 ? "!pl-0" : ""} ${i === 2 ? "max-lg:!pl-0" : ""} ${
              i % 2 === 1 ? "border-l border-line" : ""
            } ${i > 1 ? "border-t border-line lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
          >
            <dt className="text-[14px] font-medium text-ink/65">{item.label}</dt>
            <dd className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold leading-none tracking-tight">
              {item.value}
            </dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}

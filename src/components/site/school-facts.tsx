import { Reveal } from "./reveal";

export type Fact = { label: string; value: string };

// A plain definition list: the shape that both readers and answer engines can lift facts from.
export function SchoolFacts({ title, facts }: { title: string; facts: Fact[] }) {
  return (
    <section aria-labelledby="school-facts-title" className="wrap py-12 sm:py-16 lg:py-20">
      <Reveal>
        <h2
          id="school-facts-title"
          className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance"
        >
          {title}
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <dl className="mt-10 grid grid-cols-1 gap-x-14 border-b border-line md:grid-cols-2 md:[&>div:nth-last-child(2)]:border-b-0">
          {facts.map((fact) => (
            <div key={fact.label} className="grid gap-1.5 border-t border-line py-5 sm:grid-cols-[10.5rem_1fr] sm:gap-6">
              <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-moss">{fact.label}</dt>
              <dd className="text-[16px] leading-[1.65] text-ink/80">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

import { useLocale, useTranslations } from "next-intl";
import { getContact } from "@/lib/center";
import { publicTestimonials } from "@/lib/content/testimonials";
import type { ContentLocale } from "@/lib/content/shared";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";
import { YoutubeIcon } from "./social-icons";
import { TestimonialWall } from "./testimonial-wall";

export function Testimonials({ index, id = "video-fikrlar" }: { index?: string; id?: string }) {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const CONTACT = getContact();

  const items = publicTestimonials(locale as ContentLocale).map((video) => ({
    id: video.id,
    thumb: video.thumb,
    chip: video.chip,
    title: video.title,
    description: video.description,
  }));
  if (items.length === 0) return null;

  return (
    <section id={id} className="brand-feature py-16 sm:py-20 lg:py-24">
      <div className="wrap">
        <SectionHead index={index} label={t("label")}>
          {t("titleA")} <span className="text-highlight">{t("titleEm")}</span>
        </SectionHead>
      </div>

      <Reveal delay={100}>
        <TestimonialWall
          items={items}
          locale={locale}
          labels={{
            region: t("region"),
            play: t("play"),
            close: t("close"),
            prev: t("prev"),
            next: t("next"),
            youtube: t("youtube"),
            apply: t("apply"),
          }}
        />
      </Reveal>

      <Reveal delay={220} className="wrap mt-10 flex justify-center sm:mt-12">
        <a
          href={CONTACT.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-14 items-center gap-3 rounded-full border border-on-brand/30 px-7 text-[15px] font-semibold transition-all duration-300 hover:border-highlight hover:bg-highlight hover:text-brand-deep"
        >
          <YoutubeIcon size={20} />
          {t("channel")}
        </a>
      </Reveal>
    </section>
  );
}

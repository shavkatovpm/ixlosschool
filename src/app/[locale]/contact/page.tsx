import type { Metadata } from "next";
import { Clock, MapPin, Phone, Send } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Admissions } from "@/components/site/admissions";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SchoolFacts, type Fact } from "@/components/site/school-facts";
import { InstagramIcon, YoutubeIcon } from "@/components/site/social-icons";
import { getContact, getLegal } from "@/lib/center";
import { buildMetadata, webPageNode } from "@/lib/seo";

const PATH = "/contact";

const cardClass = "h-full rounded-[28px] p-8 sm:p-10";
const iconClass = "flex h-12 w-12 items-center justify-center rounded-full bg-paper/70 text-brand";
const linkClass =
  "inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold underline decoration-ink/25 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return buildMetadata({ locale, path: PATH, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const CONTACT = getContact();
  const LEGAL = getLegal();
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  const home = await getTranslations({ locale, namespace: "pages" });
  const legal = { taxId: LEGAL.taxIdDisplay, number: LEGAL.licenseNumber, date: LEGAL.licenseDateDisplay };
  const facts = [
    ...(t.raw("facts") as Fact[]),
    { label: t("legalLabel"), value: t("legalValue", legal) },
    { label: t("licenseLabel"), value: t("licenseValue", legal) },
  ];

  const mapQuery = encodeURIComponent(`Ixlos School, ${CONTACT.address}`);
  const googleMaps = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const yandexMaps = `https://yandex.com/maps/?text=${mapQuery}`;

  return (
    <main>
      <JsonLd
        graph={webPageNode({
          locale,
          path: PATH,
          type: "ContactPage",
          name: t("h1"),
          description: t("metaDescription"),
          breadcrumb: [
            { name: home("home"), path: "" },
            { name: t("eyebrow"), path: PATH },
          ],
        })}
      />
      <PageHero crumb={t("eyebrow")} eyebrow={t("eyebrow")} title={t("h1")} lead={t("lead")} />

      <section className="wrap pb-6 sm:pb-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          <Reveal>
            <article className={`${cardClass} bg-tint-a`}>
              <span className={iconClass}>
                <MapPin size={22} aria-hidden />
              </span>
              <h2 className="mt-6 font-display text-[22px] font-bold tracking-tight">{t("addressTitle")}</h2>
              <address className="mt-3 text-[18px] font-semibold not-italic leading-[1.6]">{CONTACT.address}</address>
              <div className="mt-5 flex flex-col items-start gap-1">
                <a href={googleMaps} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {t("mapGoogle")}
                </a>
                <a href={yandexMaps} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {t("mapYandex")}
                </a>
              </div>
            </article>
          </Reveal>

          <Reveal delay={110}>
            <article className={`${cardClass} bg-tint-b`}>
              <span className={iconClass}>
                <Phone size={22} aria-hidden />
              </span>
              <h2 className="mt-6 font-display text-[22px] font-bold tracking-tight">{t("phoneTitle")}</h2>
              <ul className="mt-3 flex flex-col gap-1">
                {CONTACT.phones.map((phone, i) => (
                  <li key={phone}>
                    <a
                      href={`tel:${phone}`}
                      className="inline-flex min-h-11 items-center text-[20px] font-bold tabular-nums transition-colors hover:text-brand"
                    >
                      {CONTACT.phonesDisplay[i]}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal>
            <article className={`${cardClass} bg-tint-c`}>
              <span className={iconClass}>
                <Clock size={22} aria-hidden />
              </span>
              <h2 className="mt-6 font-display text-[22px] font-bold tracking-tight">{t("hoursTitle")}</h2>
              <p className="mt-3 text-[20px] font-bold tabular-nums">{CONTACT.hours}</p>
            </article>
          </Reveal>

          <Reveal delay={110}>
            <article className={`${cardClass} bg-tint-d`}>
              <span className={iconClass}>
                <Send size={22} aria-hidden />
              </span>
              <h2 className="mt-6 font-display text-[22px] font-bold tracking-tight">{t("socialTitle")}</h2>
              <ul className="mt-3 flex flex-col items-start gap-1">
                <li>
                  <a href={CONTACT.telegramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <Send size={17} aria-hidden />
                    Telegram {CONTACT.telegramHandle}
                  </a>
                </li>
                <li>
                  <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <InstagramIcon size={17} />
                    Instagram {CONTACT.instagramHandle}
                  </a>
                </li>
                <li>
                  <a href={CONTACT.youtubeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <YoutubeIcon size={17} />
                    YouTube
                  </a>
                </li>
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      <SchoolFacts title={t("factsTitle")} facts={facts} />

      <Admissions />
    </main>
  );
}

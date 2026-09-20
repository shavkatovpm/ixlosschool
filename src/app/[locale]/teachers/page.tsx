import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Admissions } from "@/components/site/admissions";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { TeacherCard } from "@/components/site/teacher-card";
import { SITE_URL, absoluteUrl, buildMetadata, webPageNode } from "@/lib/seo";
import { teacherName, teachers } from "@/lib/teachers";

const PATH = "/teachers";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.teachers" });
  return buildMetadata({ locale, path: PATH, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function TeachersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.teachers" });
  const tt = await getTranslations({ locale, namespace: "teachers" });
  const home = await getTranslations({ locale, namespace: "pages" });
  const pageUrl = absoluteUrl(locale, PATH);

  const people = teachers.map((teacher) => ({
    "@type": "Person",
    "@id": `${pageUrl}#${teacher.slug}`,
    name: teacherName(teacher, locale),
    image: `${SITE_URL}${teacher.photo}`,
    jobTitle: tt("jobTitle"),
    worksFor: { "@id": `${SITE_URL}/#school` },
    ...(teacher.education?.length
      ? {
          alumniOf: teacher.education.map((e) => ({
            "@type": "EducationalOrganization",
            name: tt(`institutions.${e.institution}`),
          })),
        }
      : {}),
    ...(teacher.focus ? { knowsAbout: tt(`focus.${teacher.focus}`) } : {}),
  }));

  return (
    <main>
      <JsonLd
        graph={[
          ...webPageNode({
            locale,
            path: PATH,
            name: t("h1"),
            description: t("metaDescription"),
            breadcrumb: [
              { name: home("home"), path: "" },
              { name: t("eyebrow"), path: PATH },
            ],
          }),
          {
            "@type": "ItemList",
            "@id": `${pageUrl}#teachers`,
            itemListElement: teachers.map((teacher, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: { "@id": `${pageUrl}#${teacher.slug}` },
            })),
          },
          ...people,
        ]}
      />
      <PageHero crumb={t("eyebrow")} eyebrow={t("eyebrow")} title={t("h1")} lead={t("lead")} />

      <section className="wrap pb-20 sm:pb-24 lg:pb-28">
        <ul className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {teachers.map((teacher, i) => (
            <li key={teacher.slug}>
              <Reveal delay={(i % 3) * 90} className="h-full">
                <TeacherCard teacher={teacher} priority={i < 3} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <Admissions showMore />
    </main>
  );
}

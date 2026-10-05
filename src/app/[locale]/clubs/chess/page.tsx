import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TopicPage, topicMetadata } from "@/components/site/topic-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return topicMetadata(locale, "chess");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TopicPage locale={locale} topic="chess" />;
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { AdminForm, Field, FormSection, SubmitButton } from "@/components/admin/form";
import { LocaleFields } from "@/components/admin/locale-fields";
import { PageShell, Panel, ghostButton } from "@/components/admin/ui";
import { ARTICLE_LIMITS } from "@/lib/admin/validate-article";
import { getArticleRow } from "@/lib/content/articles";
import { CONTENT_LOCALES, LOCALE_NAMES } from "@/lib/content/shared";
import { saveArticleAction } from "../actions";
import { requirePanel } from "@/lib/admin/panel";

export default async function ArticleEditPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requirePanel();
  const { id } = await params;
  const { created } = await searchParams;
  const isNew = id === "new";
  const row = isNew ? null : getArticleRow(Number(id));
  if (!isNew && !row) notFound();
  const live = row?.status === "published";

  return (
    <PageShell
      width="3xl"
      title={isNew ? "Yangi maqola" : "Maqolani tahrirlash"}
      text="Avval qoralama saqlang, so'ng uch tilda to'ldirib chop eting."
      actions={
        <>
          {row ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-ink/60">Ko&apos;rib chiqish</span>
              {CONTENT_LOCALES.map((l) => (
                <Link key={l} href={`/admin/articles/${row.id}/preview/${l}`} target="_blank" title={LOCALE_NAMES[l]} className="admin-ghost inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line px-3 text-[13px] font-bold uppercase transition-colors hover:bg-tint-a">
                  {l}
                </Link>
              ))}
            </div>
          ) : null}
          <Link href="/admin/articles" className={ghostButton}>
            ← Ro&apos;yxatga qaytish
          </Link>
        </>
      }
    >
      {created ? (
        <p role="status" className="flex items-center gap-2 rounded-[12px] bg-tint-b px-4 py-3 text-[14px] font-semibold text-brand">
          <CircleCheck size={18} aria-hidden />
          Qoralama yaratildi. Endi uch tilda to&apos;ldirib, «Saqlash va chop etish» tugmasini bosing.
        </p>
      ) : null}

      <p className="text-[13px] leading-[1.6] text-ink/65">
        Faqat tekshirilgan, maktab tasdiqlagan ma&apos;lumotlarni yozing: narx, natija va va&apos;dalarni o&apos;zingizdan qo&apos;shmang.
      </p>

      <AdminForm
        action={saveArticleAction}
        encType="multipart/form-data"
        submit="Saqlash"
        submitName="intent"
        submitValue="save"
        extra={
          <>
            {live ? (
              <SubmitButton name="intent" value="unpublish" className={ghostButton}>
                Qoralamaga qaytarish
              </SubmitButton>
            ) : (
              <SubmitButton name="intent" value="publish" className={ghostButton}>
                Saqlash va chop etish
              </SubmitButton>
            )}
            <Link href="/admin/articles" className="inline-flex h-11 items-center text-[14px] font-semibold underline-offset-4 hover:underline">
              Ro&apos;yxatga qaytish
            </Link>
          </>
        }
      >
        {row ? <input type="hidden" name="id" value={row.id} /> : null}

        <FormSection title="Umumiy">
          <Field
            name="slug"
            label="Havola nomi (slug)"
            defaultValue={row?.slug ?? ""}
            maxLength={80}
            mono
            hint={live ? "Chop etilgan maqolaning manzili o'zgarmaydi." : "Bo'sh qoldirilsa, o'zbekcha sarlavhadan yasaladi: /blog/havola-nomi. Chop etilgach o'zgartirib bo'lmaydi."}
          />
          <div>
            <label htmlFor="cover" className="block text-[14px] font-semibold">
              Muqova rasmi (ixtiyoriy)
            </label>
            <input id="cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1.5 block w-full text-[14px] file:mr-3 file:h-11 file:rounded-[12px] file:border-0 file:bg-tint-a file:px-4 file:font-semibold" />
            <p className="mt-1 text-[12.5px] leading-[1.55] text-ink/65">Yotiq rasm (16:9 yoki 1200×630). Ijtimoiy tarmoqda havola ulashilganda ham shu rasm chiqadi.</p>
            {row?.cover ? (
              <div className="mt-2">
                <Image src={row.cover} alt="" width={160} height={84} unoptimized className="h-[84px] w-40 rounded-[10px] object-cover" />
                <label className="mt-2 flex min-h-11 items-center gap-2 text-[13px] font-semibold">
                  <input type="checkbox" name="removeCover" className="h-4 w-4 accent-[var(--color-brand)]" />
                  Rasmni olib tashlash
                </label>
              </div>
            ) : null}
          </div>
        </FormSection>

        <LocaleFields
          fields={[
            { key: "title", label: "Sarlavha", maxLength: ARTICLE_LIMITS.title, counter: { soft: 60 }, required: false, hint: "Qidiruv natijasida ko'rinadi: 60 belgigacha, asosiy so'z boshida." },
            { key: "description", label: "Qisqa tavsif", multiline: 3, maxLength: ARTICLE_LIMITS.description, counter: { soft: 160 }, required: false, hint: "Qidiruv natijasidagi matn va maqola boshidagi kirish: 1–2 gap." },
            { key: "body", label: "Matn (Markdown)", multiline: 22, maxLength: ARTICLE_LIMITS.body, required: false, mono: true },
          ]}
          values={row ? { title: row.title, description: row.description, body: row.body } : undefined}
        />

        <Panel title="Matn yozish qoidalari (Markdown)">
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-[14px] bg-tint-b p-4 text-[13px] leading-[1.7]">{`## Bo'lim sarlavhasi
### Kichik sarlavha
Oddiy matn. **Qalin**, *qiya*, [havola](https://…) yoki [ichki](/uz/admissions).
- Ro'yxat bandi
1. Raqamlangan band
> Muhim izoh (iqtibos)
---  (ajratuvchi chiziq)`}</pre>
        </Panel>
      </AdminForm>
    </PageShell>
  );
}

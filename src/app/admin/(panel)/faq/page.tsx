import Link from "next/link";
import { CircleCheck, ExternalLink, Plus } from "lucide-react";
import { ListControls, StatusChip } from "@/components/admin/list-controls";
import { Empty, PageHeader, Panel, ghostButton, primaryButton } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/form";
import { defaultFaq } from "@/lib/content/defaults";
import { faqCustomized, listFaq } from "@/lib/content/faq";
import { deleteFaqAction, moveFaqAction, startFaqEditingAction, toggleFaqAction } from "./actions";
import { requirePanel } from "@/lib/admin/panel";

const TARGET = { min: 8, max: 12 };

export default async function FaqPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requirePanel();
  const { saved } = await searchParams;
  const customized = faqCustomized();
  const rows = listFaq();
  const shown = rows.filter((r) => r.published).length;

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="FAQ (savol-javob)"
        text="Bosh sahifadagi «Savol-javob» bo'limi. Har savol uch tilda kiritiladi. Bu bo'lim Google va AI yordamchilari (ChatGPT, Gemini) uchun ham «FAQPage» ma'lumoti sifatida ishlatiladi."
        actions={
          customized ? (
            <Link href="/admin/faq/new" className={primaryButton}>
              <Plus size={16} aria-hidden />
              Yangi savol
            </Link>
          ) : (
            <a href="/uz#savol-javob" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline">
              <ExternalLink size={16} aria-hidden />
              Saytda ko&apos;rish
            </a>
          )
        }
      />

      {saved ? (
        <p role="status" className="flex items-center gap-2 rounded-[12px] bg-tint-b px-4 py-3 text-[14px] font-semibold text-brand">
          <CircleCheck size={18} aria-hidden />
          Yangi savol qo&apos;shildi.
        </p>
      ) : null}

      {!customized ? (
        <Panel title="Hozir saytda standart savollar turibdi" hint={`${defaultFaq().length} ta savol. Tahrirlashni boshlasangiz, ular shu yerga ko'chiriladi va o'zgartira olasiz.`}>
          <form action={startFaqEditingAction}>
            <SubmitButton>Tahrirlashni boshlash</SubmitButton>
          </form>
        </Panel>
      ) : (
        <>
          <p className={`text-[14px] ${shown >= TARGET.min && shown <= TARGET.max ? "text-ink/75" : "font-semibold text-danger"}`}>
            Saytda ko&apos;rinayotgan savollar: {shown} ta. AI qidiruvi uchun {TARGET.min}–{TARGET.max} ta aniq savol yetarli; juda ko&apos;p bo&apos;lsa, javoblar ta&apos;sirini yo&apos;qotadi.
          </p>
          {rows.length === 0 ? (
            <Empty>Hech qanday savol yo&apos;q: sayt bo&apos;limi yashirilgan. «Yangi savol» bilan qo&apos;shing.</Empty>
          ) : (
            <ol className="divide-y divide-line rounded-[22px] bg-surface">
              {rows.map((row, index) => (
                <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 basis-72">
                    <p className="text-[12px] font-bold text-ink/55">#{index + 1}</p>
                    <p className="mt-0.5 text-[16px] font-bold leading-snug">{row.question.uz}</p>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-[1.6] text-ink/70">{row.answer.uz}</p>
                    <div className="mt-2">
                      <StatusChip published={row.published} />
                    </div>
                  </div>
                  <ListControls
                    id={row.id}
                    editHref={`/admin/faq/${row.id}`}
                    published={row.published}
                    first={index === 0}
                    last={index === rows.length - 1}
                    moveAction={moveFaqAction}
                    toggleAction={toggleFaqAction}
                    deleteAction={deleteFaqAction}
                    confirmText="Bu savolni o'chirasizmi? Bu amalni qaytarib bo'lmaydi."
                  />
                </li>
              ))}
            </ol>
          )}
          <a href="/uz#savol-javob" target="_blank" rel="noopener noreferrer" className={ghostButton}>
            <ExternalLink size={16} aria-hidden />
            Saytda ko&apos;rish
          </a>
        </>
      )}
    </div>
  );
}

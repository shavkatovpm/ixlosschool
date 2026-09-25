import Image from "next/image";
import Link from "next/link";
import { CircleCheck, ExternalLink, Plus } from "lucide-react";
import { SubmitButton } from "@/components/admin/form";
import { ListControls, StatusChip } from "@/components/admin/list-controls";
import { Empty, PageShell, Panel, ghostButton, primaryButton } from "@/components/admin/ui";
import { defaultTestimonials, listTestimonials, testimonialsCustomized } from "@/lib/content/testimonials";
import { deleteTestimonialAction, moveTestimonialAction, startTestimonialsEditingAction, toggleTestimonialAction } from "./actions";
import { requirePanel } from "@/lib/admin/panel";

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requirePanel();
  const { saved } = await searchParams;
  const customized = testimonialsCustomized();
  const rows = listTestimonials();

  return (
    <PageShell
      width="4xl"
      title="O'quvchilar fikri"
      text="Bosh sahifa va «Natijalar»dagi video fikrlar (YouTube)."
      actions={
        customized ? (
          <Link href="/admin/testimonials/new" className={primaryButton}>
            <Plus size={16} aria-hidden />
            Video qo&apos;shish
          </Link>
        ) : null
      }
    >
      {saved ? (
        <p role="status" className="flex items-center gap-2 rounded-[12px] bg-tint-b px-4 py-3 text-[14px] font-semibold text-brand">
          <CircleCheck size={18} aria-hidden />
          Video qo&apos;shildi.
        </p>
      ) : null}

      {!customized ? (
        <Panel title="Hozir saytda standart videolar turibdi" hint={`${defaultTestimonials().length} ta video. Tahrirlashni boshlasangiz, ular shu yerga ko'chiriladi va yangilarini qo'shish, tartibini o'zgartirish mumkin bo'ladi.`}>
          <form action={startTestimonialsEditingAction}>
            <SubmitButton>Tahrirlashni boshlash</SubmitButton>
          </form>
        </Panel>
      ) : rows.length === 0 ? (
        <Empty>Video yo&apos;q: sayt bo&apos;limi yashirilgan. «Video qo&apos;shish» bilan yangisini qo&apos;shing.</Empty>
      ) : (
        <ol className="divide-y divide-line rounded-[22px] bg-surface">
          {rows.map((row, index) => (
            <li key={row.id} className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6">
              <Image src={row.thumb} alt="" width={54} height={96} unoptimized className="h-24 w-[54px] shrink-0 rounded-[10px] object-cover" />
              <div className="min-w-0 flex-1 basis-56">
                <p className="text-[12px] font-bold text-ink/55">
                  #{index + 1} · {row.chip.uz}
                </p>
                <p className="mt-0.5 text-[16px] font-bold leading-snug">{row.title.uz}</p>
                <p className="mt-1 text-[13px] text-ink/65">
                  <a href={`https://www.youtube.com/shorts/${row.youtubeId}`} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                    YouTube · {row.youtubeId}
                  </a>{" "}
                  · yuklangan {row.uploadDate.slice(0, 10)}
                </p>
                <div className="mt-2">
                  <StatusChip published={row.published} />
                </div>
              </div>
              <ListControls
                id={row.id}
                editHref={`/admin/testimonials/${row.id}`}
                published={row.published}
                first={index === 0}
                last={index === rows.length - 1}
                moveAction={moveTestimonialAction}
                toggleAction={toggleTestimonialAction}
                deleteAction={deleteTestimonialAction}
                confirmText="Bu videoni saytdan o'chirasizmi? (YouTube'dagi videoning o'zi o'chmaydi.)"
              />
            </li>
          ))}
        </ol>
      )}

      <a href="/uz/results#video-fikrlar" target="_blank" rel="noopener noreferrer" className={ghostButton}>
        <ExternalLink size={16} aria-hidden />
        Saytda ko&apos;rish
      </a>
    </PageShell>
  );
}

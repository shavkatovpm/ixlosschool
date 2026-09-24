import Image from "next/image";
import Link from "next/link";
import { CircleCheck, ExternalLink, Plus } from "lucide-react";
import { SubmitButton } from "@/components/admin/form";
import { ListControls, StatusChip } from "@/components/admin/list-controls";
import { Empty, PageHeader, Panel, ghostButton, primaryButton } from "@/components/admin/ui";
import { defaultTeachers, listTeachers, teachersCustomized } from "@/lib/content/teachers";
import { deleteTeacherAction, moveTeacherAction, startTeachersEditingAction, toggleTeacherAction } from "./actions";
import { requirePanel } from "@/lib/admin/panel";

export default async function TeachersAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requirePanel();
  const { saved } = await searchParams;
  const customized = teachersCustomized();
  const rows = listTeachers();

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Ustozlar"
        text="Bosh sahifadagi ustozlar bo'limi va «Ustozlar» sahifasi. Ustoz qo'shish, ma'lumotini o'zgartirish, tartibini belgilash yoki vaqtincha yashirish mumkin."
        actions={
          customized ? (
            <Link href="/admin/teachers/new" className={primaryButton}>
              <Plus size={16} aria-hidden />
              Ustoz qo&apos;shish
            </Link>
          ) : null
        }
      />

      {saved ? (
        <p role="status" className="flex items-center gap-2 rounded-[12px] bg-tint-b px-4 py-3 text-[14px] font-semibold text-brand">
          <CircleCheck size={18} aria-hidden />
          Ustoz qo&apos;shildi.
        </p>
      ) : null}

      {!customized ? (
        <Panel title="Hozir saytda standart ro'yxat turibdi" hint={`${defaultTeachers().length} ta ustoz. Tahrirlashni boshlasangiz, ular shu yerga ko'chiriladi va o'zgartira olasiz.`}>
          <form action={startTeachersEditingAction}>
            <SubmitButton>Tahrirlashni boshlash</SubmitButton>
          </form>
        </Panel>
      ) : rows.length === 0 ? (
        <Empty>Ustoz yo&apos;q: sayt bo&apos;limi yashirilgan. «Ustoz qo&apos;shish» bilan yangisini qo&apos;shing.</Empty>
      ) : (
        <ol className="divide-y divide-line rounded-[22px] bg-surface">
          {rows.map((row, index) => (
            <li key={row.id} className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6">
              <Image src={row.photo} alt="" width={64} height={80} unoptimized className="h-20 w-16 shrink-0 rounded-[10px] object-cover" />
              <div className="min-w-0 flex-1 basis-56">
                <p className="text-[12px] font-bold text-ink/55">#{index + 1}</p>
                <p className="text-[16px] font-bold leading-snug">{row.nameLatin}</p>
                <p className="text-[13px] text-ink/65">
                  {[row.experienceYears != null ? `${row.experienceYears} yil staj` : null, row.focus?.uz, row.education.length ? `${row.education.length} ta ta'lim` : null, row.credentials.length ? `${row.credentials.length} ta sertifikat` : null]
                    .filter(Boolean)
                    .join(" · ") || "Qo'shimcha ma'lumot kiritilmagan"}
                </p>
                <div className="mt-2">
                  <StatusChip published={row.published} />
                </div>
              </div>
              <ListControls
                id={row.id}
                editHref={`/admin/teachers/${row.id}`}
                published={row.published}
                first={index === 0}
                last={index === rows.length - 1}
                moveAction={moveTeacherAction}
                toggleAction={toggleTeacherAction}
                deleteAction={deleteTeacherAction}
                confirmText={`${row.nameLatin} saytdan o'chirilsinmi? Bu amalni qaytarib bo'lmaydi (vaqtincha yashirish uchun «ko'z» tugmasidan foydalaning).`}
              />
            </li>
          ))}
        </ol>
      )}

      <a href="/uz/teachers" target="_blank" rel="noopener noreferrer" className={ghostButton}>
        <ExternalLink size={16} aria-hidden />
        Saytda ko&apos;rish
      </a>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm, CheckboxField } from "@/components/admin/form";
import { LocaleFields } from "@/components/admin/locale-fields";
import { PageShell, ghostButton } from "@/components/admin/ui";
import { getFaqRow } from "@/lib/content/faq";
import { saveFaqAction } from "../actions";
import { requirePanel } from "@/lib/admin/panel";

export default async function FaqEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePanel();
  const { id } = await params;
  const isNew = id === "new";
  const row = isNew ? null : getFaqRow(Number(id));
  if (!isNew && !row) notFound();

  return (
    <PageShell
      width="3xl"
      title={isNew ? "Yangi savol" : "Savolni tahrirlash"}
      text="Uch tilning hammasi to'ldirilishi shart."
      actions={
        <Link href="/admin/faq" className={ghostButton}>
          ← Ro&apos;yxatga qaytish
        </Link>
      }
    >
      <AdminForm
        action={saveFaqAction}
        extra={
          <Link href="/admin/faq" className="inline-flex h-11 items-center text-[14px] font-semibold underline-offset-4 hover:underline">
            Ro&apos;yxatga qaytish
          </Link>
        }
      >
        {row ? <input type="hidden" name="id" value={row.id} /> : null}
        <LocaleFields
          fields={[
            { key: "question", label: "Savol", maxLength: 200, counter: { soft: 120 } },
            { key: "answer", label: "Javob", multiline: 5, maxLength: 1500 },
          ]}
          values={row ? { question: row.question, answer: row.answer } : undefined}
        />
        <CheckboxField name="published" label="Saytda ko'rsatilsin" defaultChecked={row ? row.published : true} />
      </AdminForm>
    </PageShell>
  );
}

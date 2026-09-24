import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm, CheckboxField, Field, FormSection } from "@/components/admin/form";
import { LocaleFields } from "@/components/admin/locale-fields";
import { PageHeader } from "@/components/admin/ui";
import { getTestimonialRow } from "@/lib/content/testimonials";
import { saveTestimonialAction } from "../actions";

export default async function TestimonialEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const row = isNew ? null : getTestimonialRow(Number(id));
  if (!isNew && !row) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title={isNew ? "Video qo'shish" : "Videoni tahrirlash"}
        text="Videoning YouTube havolasini kiriting: rasmi (miniatyura) avtomatik olinadi. Video o'zbek tilida bo'lsa ham, matnlar uch tilda yoziladi."
      />
      <AdminForm
        action={saveTestimonialAction}
        encType="multipart/form-data"
        extra={
          <Link href="/admin/testimonials" className="inline-flex h-11 items-center text-[14px] font-semibold underline-offset-4 hover:underline">
            Ro&apos;yxatga qaytish
          </Link>
        }
      >
        {row ? <input type="hidden" name="id" value={row.id} /> : null}
        <FormSection title="Video">
          <Field
            name="youtube"
            label="YouTube havolasi"
            type="url"
            required
            maxLength={200}
            defaultValue={row ? `https://www.youtube.com/shorts/${row.youtubeId}` : ""}
            placeholder="https://www.youtube.com/shorts/…"
            className="sm:col-span-2"
          />
          <Field name="uploadDate" label="YouTube'ga yuklangan sana" type="date" required defaultValue={row?.uploadDate ?? ""} hint="Google'ga video ma'lumoti sifatida beriladi: YouTube Studio'dagi haqiqiy sanani kiriting." />
          <div>
            <label htmlFor="thumb" className="block text-[14px] font-semibold">
              Miniatyura (ixtiyoriy)
            </label>
            <input id="thumb" name="thumb" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1.5 block w-full text-[14px] file:mr-3 file:h-11 file:rounded-[12px] file:border-0 file:bg-tint-a file:px-4 file:font-semibold" />
            <p className="mt-1 text-[12.5px] leading-[1.55] text-ink/65">Bo&apos;sh qoldirilsa, YouTube&apos;dagi rasm olinadi. Tik (9:16) rasm yaxshi chiqadi.</p>
            {row ? <Image src={row.thumb} alt="" width={54} height={96} unoptimized className="mt-2 h-24 w-[54px] rounded-[10px] object-cover" /> : null}
          </div>
        </FormSection>
        <LocaleFields
          fields={[
            { key: "chip", label: "Qisqa belgi (kartadagi yorliq)", maxLength: 40 },
            { key: "title", label: "Sarlavha", maxLength: 140 },
            { key: "description", label: "Tavsif", multiline: 3, maxLength: 320, hint: "Video mazmunini faqat haqiqatda aytilgan ma'lumotlar bilan qisqa yozing." },
          ]}
          values={row ? { chip: row.chip, title: row.title, description: row.description } : undefined}
        />
        <CheckboxField name="published" label="Saytda ko'rsatilsin" defaultChecked={row ? row.published : true} />
      </AdminForm>
    </div>
  );
}

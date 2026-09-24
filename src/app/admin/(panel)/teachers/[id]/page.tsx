import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm, CheckboxField, Field, FormSection, SelectField } from "@/components/admin/form";
import { PageHeader } from "@/components/admin/ui";
import { CREDENTIAL_SLOTS, EDUCATION_SLOTS } from "@/lib/admin/validate-teacher";
import { CONTENT_LOCALES, LOCALE_NAMES } from "@/lib/content/shared";
import { getTeacherRow } from "@/lib/content/teachers";
import { saveTeacherAction } from "../actions";

const slots = (count: number) => Array.from({ length: count }, (_, i) => i + 1);

export default async function TeacherEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const row = isNew ? null : getTeacherRow(Number(id));
  if (!isNew && !row) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title={isNew ? "Yangi ustoz" : "Ustozni tahrirlash"}
        text="Faqat maktab bergan tasdiqlangan ma'lumotlarni kiriting: diplom, sertifikat va staj hujjatlarga mos bo'lsin. Ruscha/inglizcha maydon bo'sh qolsa, o'zbekcha matn ishlatiladi."
      />
      <AdminForm
        action={saveTeacherAction}
        encType="multipart/form-data"
        extra={
          <Link href="/admin/teachers" className="inline-flex h-11 items-center text-[14px] font-semibold underline-offset-4 hover:underline">
            Ro&apos;yxatga qaytish
          </Link>
        }
      >
        {row ? <input type="hidden" name="id" value={row.id} /> : null}

        <FormSection title="Asosiy ma'lumot">
          <Field name="nameLatin" label="Ism-familiya (lotin)" defaultValue={row?.nameLatin ?? ""} required maxLength={80} hint="O'zbekcha va inglizcha sahifalarda ko'rinadi." />
          <Field name="nameCyrillic" label="Ism-familiya (kirill)" defaultValue={row?.nameCyrillic ?? ""} required maxLength={80} hint="Ruscha sahifalarda ko'rinadi." />
          <Field name="experienceYears" label="Ish staji (yil)" type="number" defaultValue={row?.experienceYears != null ? String(row.experienceYears) : ""} hint="Bo'sh qoldirilsa, belgi ko'rsatilmaydi." />
          <SelectField
            name="category"
            label="Malaka toifasi"
            defaultValue={row?.category ?? ""}
            options={[
              { value: "", label: "Ko'rsatilmasin" },
              { value: "first", label: "1-toifali o'qituvchi" },
              { value: "highest", label: "Oliy toifali o'qituvchi" },
            ]}
          />
          <div className="sm:col-span-2">
            <label htmlFor="photo" className="block text-[14px] font-semibold">
              Rasm {row ? "(almashtirish uchun tanlang)" : <span className="text-danger">*</span>}
            </label>
            <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1.5 block w-full text-[14px] file:mr-3 file:h-11 file:rounded-[12px] file:border-0 file:bg-tint-a file:px-4 file:font-semibold" />
            <p className="mt-1 text-[12.5px] leading-[1.55] text-ink/65">Yuz aniq ko&apos;ringan vertikal (4:5) rasm. Katta rasm avtomatik kichraytiriladi va kesiladi.</p>
            {row ? <Image src={row.photo} alt="" width={80} height={100} unoptimized className="mt-2 h-[100px] w-20 rounded-[10px] object-cover" /> : null}
          </div>
        </FormSection>

        <FormSection title="Yo'nalish (ixtiyoriy)" hint="Fotosuratdagi rangli belgi: masalan «Robototexnika», «ACCA».">
          {CONTENT_LOCALES.map((locale) => (
            <Field key={locale} name={`focus_${locale}`} label={LOCALE_NAMES[locale]} defaultValue={row?.focus?.[locale] ?? ""} maxLength={60} />
          ))}
        </FormSection>

        {slots(EDUCATION_SLOTS).map((i) => {
          const edu = row?.education[i - 1];
          return (
            <FormSection key={i} title={`Ta'lim ${i}`} hint={i === 1 ? "Bo'sh qoldirilgan bloklar saytda ko'rsatilmaydi." : undefined}>
              <SelectField
                name={`edu${i}_degree`}
                label="Daraja"
                defaultValue={edu?.degree ?? ""}
                className="sm:col-span-2"
                options={[
                  { value: "", label: "Ta'lim (daraja ko'rsatilmagan)" },
                  { value: "bachelor", label: "Bakalavr" },
                  { value: "master", label: "Magistratura" },
                  { value: "bachelorMaster", label: "Bakalavr va magistratura" },
                ]}
              />
              {CONTENT_LOCALES.map((locale) => (
                <Field key={locale} name={`edu${i}_${locale}`} label={`O'quv yurti — ${LOCALE_NAMES[locale].toLowerCase()}`} defaultValue={edu?.institution[locale] ?? ""} maxLength={120} className={locale === "uz" ? "sm:col-span-2" : ""} />
              ))}
            </FormSection>
          );
        })}

        {slots(CREDENTIAL_SLOTS).map((i) => {
          const cred = row?.credentials[i - 1];
          return (
            <FormSection key={i} title={`Sertifikat / malaka ${i}`} hint={i === 1 ? "Masalan: «Sertifikat» — C1; «ACCA» — F1–F7, F9. Nomi uch tilda, qiymat bitta." : undefined}>
              {CONTENT_LOCALES.map((locale) => (
                <Field key={locale} name={`cred${i}_label_${locale}`} label={`Nomi — ${LOCALE_NAMES[locale].toLowerCase()}`} defaultValue={cred?.label[locale] ?? ""} maxLength={80} />
              ))}
              <Field name={`cred${i}_value`} label="Qiymat" defaultValue={cred?.value ?? ""} maxLength={80} />
            </FormSection>
          );
        })}

        <CheckboxField name="published" label="Saytda ko'rsatilsin" defaultChecked={row ? row.published : true} />
      </AdminForm>
    </div>
  );
}

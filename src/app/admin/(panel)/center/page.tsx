import { ExternalLink } from "lucide-react";
import { AdminForm, Field, FormSection } from "@/components/admin/form";
import { PageHeader } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/admin/leads";
import { CENTER_KEY, formatPhone, getCenterInput } from "@/lib/center";
import { settingUpdatedAt } from "@/lib/settings";
import { saveCenterAction } from "./actions";

export default function CenterPage() {
  const c = getCenterInput();
  const updated = settingUpdatedAt(CENTER_KEY);

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Markaz ma'lumotlari"
        text="Telefon, manzil, ish vaqti, ijtimoiy tarmoqlar va yuridik ma'lumotlar. Bu yerda o'zgartirilgan qiymat saytning hamma joyida (sahifa pastki qismi, Aloqa sahifasi, ariza formasi, Google uchun ma'lumotlar va llms.txt) birdaniga yangilanadi."
        actions={
          <a href="/uz/contact" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline">
            <ExternalLink size={16} aria-hidden />
            Aloqa sahifasi
          </a>
        }
      />
      <p className="text-[13px] text-ink/60">{updated ? `Oxirgi o'zgartirish: ${formatDateTime(updated)}` : "Hozircha saytdagi standart ma'lumotlar ko'rsatilgan; saqlaganingizdan keyin shu yerdagi qiymatlar ishlaydi."}</p>

      <AdminForm action={saveCenterAction}>
        <FormSection title="Telefon raqamlar" hint="Birinchi raqam saytda asosiy (tugmalar, footer, ariza formasi) bo'lib chiqadi. Qolganlari Aloqa sahifasida va Google uchun ma'lumotlarda ko'rsatiladi.">
          <Field name="phone1" label="Asosiy raqam" type="tel" defaultValue={formatPhone(c.phones[0] ?? "")} required maxLength={30} />
          <Field name="phone2" label="Qo'shimcha raqam" type="tel" defaultValue={formatPhone(c.phones[1] ?? "")} maxLength={30} />
          <Field name="phone3" label="Yana bir raqam (ixtiyoriy)" type="tel" defaultValue={formatPhone(c.phones[2] ?? "")} maxLength={30} />
        </FormSection>

        <FormSection title="Manzil" hint="Lotin yozuvida, xaritalar va yetkazib berish xizmatlaridagi yozuvga mos.">
          <Field name="city" label="Shahar" defaultValue={c.city} required maxLength={60} />
          <Field name="district" label="Tuman" defaultValue={c.district} required maxLength={60} />
          <Field
            name="street"
            label="Ko'cha va uy"
            defaultValue={c.street}
            required
            maxLength={120}
            className="sm:col-span-2"
            hint="Diqqat: litsenziyada faoliyat manzili «Bog'ishamol ko'chasi, 221-uy» deb yozilgan, saytda esa rahbariyat bergan 219-uy turibdi. To'g'ri raqamni tasdiqlab, shu yerda to'g'rilang."
          />
        </FormSection>

        <FormSection title="Ish vaqti">
          <Field name="opens" label="Ochilish" type="time" defaultValue={c.opens} required />
          <Field name="closes" label="Yopilish" type="time" defaultValue={c.closes} required />
        </FormSection>

        <FormSection title="Ijtimoiy tarmoqlar" hint="To'liq havola (https://…), kanal yoki akkaunt nomi bilan.">
          <Field name="telegramUrl" label="Telegram" type="url" defaultValue={c.telegramUrl} required maxLength={200} placeholder="https://t.me/…" />
          <Field name="instagramUrl" label="Instagram" type="url" defaultValue={c.instagramUrl} required maxLength={200} placeholder="https://www.instagram.com/…" />
          <Field name="youtubeUrl" label="YouTube" type="url" defaultValue={c.youtubeUrl} required maxLength={200} placeholder="https://www.youtube.com/@…" className="sm:col-span-2" />
        </FormSection>

        <FormSection title="Yuridik ma'lumot va litsenziya" hint="Sayt pastki qismida va Google uchun ma'lumotlarda ko'rsatiladi. Faqat hujjatlardagi qiymatlarni kiriting.">
          <Field name="legalName" label="Yuridik shaxs nomi" defaultValue={c.legalName} required maxLength={200} className="sm:col-span-2" />
          <Field name="taxId" label="STIR (9 ta raqam)" defaultValue={c.taxId} required maxLength={12} />
          <Field name="licenseNumber" label="Litsenziya raqami" defaultValue={c.licenseNumber} required maxLength={30} />
          <Field name="licenseDate" label="Litsenziya berilgan sana" type="date" defaultValue={c.licenseDate} required />
        </FormSection>
      </AdminForm>
    </div>
  );
}

import { CircleAlert, CircleCheck, Download } from "lucide-react";
import { AdminForm, Field, FormSection } from "@/components/admin/form";
import { ExcludeDevice } from "@/components/admin/exclude-device";
import { PageHeader, Panel, ghostButton } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/form";
import { listBackups } from "@/lib/admin/backup";
import { formatDateTime } from "@/lib/admin/leads";
import { formatBytes, systemInfo } from "@/lib/admin/system";
import { getIntegrations } from "@/lib/integrations";
import { telegramConfigured } from "@/lib/telegram";
import { createBackupAction, saveIntegrationsAction, testTelegramAction } from "./actions";

const DONE: Record<string, { text: string; error?: boolean }> = {
  backup: { text: "Zaxira nusxa yaratildi." },
  "backup-failed": { text: "Zaxira nusxa yaratib bo'lmadi. Server logini tekshiring.", error: true },
  "telegram-sent": { text: "Test xabar Telegram guruhiga yuborildi. Guruhni tekshiring." },
  "telegram-failed": { text: "Telegram xabarni qabul qilmadi. Bot guruhda ekanini va token/chat ID to'g'riligini tekshiring.", error: true },
  "telegram-missing": { text: "Serverda Telegram sozlanmagan (TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID yo'q).", error: true },
};

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ done?: string }> }) {
  const { done } = await searchParams;
  const notice = done ? DONE[done] : undefined;
  const integrations = getIntegrations();
  const backups = listBackups();
  const info = systemInfo();
  const telegram = telegramConfigured();

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Sozlamalar" text="Analitika kodlari, ariza bildirishnomalari, zaxira nusxalar va tizim holati." />

      {notice ? (
        <p role="status" className={`flex items-center gap-2 rounded-[12px] px-4 py-3 text-[14px] font-semibold ${notice.error ? "bg-danger-bg text-danger" : "bg-tint-b text-brand"}`}>
          {notice.error ? <CircleAlert size={18} aria-hidden /> : <CircleCheck size={18} aria-hidden />}
          {notice.text}
        </p>
      ) : null}

      <AdminForm action={saveIntegrationsAction}>
        <FormSection
          title="Analitika va tasdiqlash kodlari"
          hint="Bo'sh qoldirilsa, tegishli skript saytga qo'shilmaydi. Saqlangach kodlar saytga darhol qo'shiladi (qayta joylashtirish shart emas)."
        >
          <Field name="gaId" label="Google Analytics ID" defaultValue={integrations.gaId} placeholder="G-XXXXXXXXXX" maxLength={30} />
          <Field name="ymId" label="Yandex Metrica hisoblagichi" defaultValue={integrations.ymId} placeholder="12345678" maxLength={14} />
          <Field name="googleVerification" label="Google Search Console kodi" defaultValue={integrations.googleVerification} maxLength={200} mono hint="Meta-teg usulidagi kod. DNS orqali tasdiqlangan bo'lsa, shart emas." />
          <Field name="yandexVerification" label="Yandex Webmaster kodi" defaultValue={integrations.yandexVerification} maxLength={200} mono />
        </FormSection>
      </AdminForm>

      <Panel title="Arizalar Telegram guruhiga" hint="Sayt formasi arizalarni shu guruhga yuboradi. Token serverda saqlanadi va bu yerda ko'rsatilmaydi.">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] font-semibold">
            Holat:{" "}
            <span className={telegram ? "text-brand" : "text-danger"}>{telegram ? "ulangan" : "sozlanmagan"}</span>
          </p>
          <form action={testTelegramAction}>
            <SubmitButton className={ghostButton}>Test xabar yuborish</SubmitButton>
          </form>
        </div>
      </Panel>

      <Panel
        title="Ma'lumotlar bazasi zaxirasi"
        hint="Har kuni avtomatik nusxa olinadi (oxirgi 14 tasi saqlanadi). Nusxalar serverning o'sha diskida turadi: server o'chib ketishidan himoya qilmaydi, shuning uchun DigitalOcean'da «Backups» xizmatini ham yoqing."
        action={
          <form action={createBackupAction} className="shrink-0">
            <SubmitButton className={`${ghostButton} whitespace-nowrap`}>Hozir nusxa olish</SubmitButton>
          </form>
        }
      >
        {backups.length === 0 ? (
          <p className="rounded-[14px] bg-tint-b px-4 py-4 text-[14px] text-ink/75">Hali nusxa yo&apos;q. Birinchisi server ishga tushganidan keyin bir daqiqa ichida olinadi.</p>
        ) : (
          <ul className="divide-y divide-line/60">
            {backups.map((b) => (
              <li key={b.name} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[14px] font-semibold">{formatDateTime(b.createdAt)}</p>
                  <p className="text-[12px] text-ink/60">
                    {b.name} · {formatBytes(b.size)}
                  </p>
                </div>
                {/* A file download, not a page. */}
                <a href={`/admin/settings/backup/${b.name}`} className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-brand underline-offset-4 hover:underline">
                  <Download size={15} aria-hidden />
                  Yuklab olish
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-[12.5px] leading-[1.6] text-ink/65">Zaxira faylda barcha arizalar (ism va telefonlar) bor: uni begonalarga bermang.</p>
      </Panel>

      <Panel title="Statistika" hint="O'zingiz saytni ko'rganda statistikaga qo'shilmasligi uchun.">
        <ExcludeDevice />
      </Panel>

      <Panel title="Tizim">
        <dl className="grid gap-x-8 gap-y-2 text-[14px] sm:grid-cols-2">
          {[
            ["Versiya (release)", info.release],
            ["Node.js", info.node],
            ["Ma'lumotlar bazasi", `${formatBytes(info.dbSize)} · sxema v${info.schemaVersion}`],
            ["Arizalar", String(info.leads)],
            ["Statistika yozuvlari", String(info.pageviews)],
            ["Server ishlagan vaqt", `${info.uptimeMinutes} daqiqa`],
          ].map(([term, value]) => (
            <div key={term} className="flex justify-between gap-3 border-b border-line/50 py-1.5">
              <dt className="text-ink/70">{term}</dt>
              <dd className="text-right font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>
  );
}

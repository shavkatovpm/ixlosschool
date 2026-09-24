# Ixlos School — admin panel

> **Holat (2026-09-24):** panel to'liq: **Dashboard, Trafik, Leadlar** (asosiy) va **Ustozlar, Maqolalar, O'quvchilar fikri, FAQ, Markaz ma'lumotlari, Sozlamalar**. Serverda `https://www.ixlosschool.uz/admin` (2026-09-25 deploy qilingan, release `20260925-001035-9939f84`).
>
> **Tamoyillar (egasi):** bitta super-admin (foydalanuvchilar/rollar yo'q); imtihon jadvali moduli yo'q; panel **faqat sayt boshqaruvi** uchun: arizalarni yuritish (CRM: holatlar, izohlar) qilinmaydi, arizalar bilan Telegram'da ishlanadi. Har matn uch tilda (UZ/RU/EN) to'liq bo'lishi shart.

## Bo'limlar

| Bo'lim | Nima qiladi | Saytga ta'siri |
|---|---|---|
| **Dashboard** `/admin` | Oxirgi 7 kun (oldingi 7 kun bilan solishtirma): tashrifchilar, ko'rishlar, arizalar, "hozir saytda"; 14 kunlik grafik; so'nggi arizalar; manbalar; sahifalar; Google/AI botlari oxirgi kelgan vaqti | — |
| **Trafik** `/admin/traffic` | 7/30/90 kun: KPI (+% o'zgarish), kunlik grafiklar, sahifalar, manbalar (Google, Instagram, Telegram, ChatGPT…) va ulardan kelgan arizalar, til, qurilma/brauzer, UTM kampaniyalar, **qidiruv va AI botlari jadvali**, konversiya | — |
| **Leadlar** `/admin/leads` | Arizalar arxivi: qidiruv, sana/manba/til/sinf filtri, har ariza qayerdan kelgani (manba, kampaniya, qurilma, kirish sahifasi), filtr bilan CSV | — |
| **Ustozlar** `/admin/teachers` | Qo'shish/tahrirlash/tartiblash/yashirish/o'chirish; rasm yuklash (4:5 WebP); ism (lotin+kirill), staj, toifa, yo'nalish, ta'lim, sertifikatlar | Bosh sahifa bo'limi, `/teachers`, Person JSON-LD, "N ustoz — M yilgacha tajriba" belgisi avtomatik |
| **Maqolalar** `/admin/articles` | Qoralama/chop etish, uch tilda sarlavha (≤60) / tavsif (≤160) hisoblagichi, Markdown matn, muqova rasmi, til bo'yicha ko'rib chiqish | `/blog`, `/blog/[slug]` (BlogPosting JSON-LD, hreflang, OG), sitemap, llms.txt, footer havolasi. Chop etilgan maqola manzili o'zgarmaydi. Maqola yo'q bo'lsa `/blog` 404 |
| **O'quvchilar fikri** `/admin/testimonials` | YouTube videoni havola bilan qo'shish (miniatyura avtomatik olinadi yoki yuklanadi), tartib, yashirish, o'chirish | Video devori (bosh sahifa va `/results`), VideoObject JSON-LD |
| **FAQ** `/admin/faq` | Savol-javob qo'shish/tahrirlash/tartiblash/yashirish; ko'rinayotganlar soni (AI uchun 8–12 tavsiya) | Bosh sahifa FAQ, FAQPage JSON-LD |
| **Markaz ma'lumotlari** `/admin/center` | Telefonlar, manzil, ish vaqti, Telegram/Instagram/YouTube, tashkilot nomi, STIR, litsenziya | Footer, Aloqa sahifasi, ariza formasi, mobil menyu, School JSON-LD, `llms.txt` |
| **Sozlamalar** `/admin/settings` | GA/Yandex Metrica ID, Google/Yandex tasdiqlash kodi; Telegram test xabari; bazani zaxiralash (avtomatik kunlik, qo'lda, yuklab olish); statistikadan o'z qurilmani chiqarish; tizim ma'lumoti | Analitika skriptlari va meta teglar darhol |
| **Hisob** `/admin/account` | Email va parolni o'zgartirish. Vaqtinchalik parolli hisob (`ADMIN_MUST_CHANGE=1`) birinchi kirishda faqat shu sahifaga o'tkaziladi | — |

**Standart kontent:** FAQ, ustozlar va videolar bo'limlari panelda "Tahrirlashni boshlash" bosilmaguncha kod ichidagi (messages/*.json, `src/lib/teachers.ts`, `src/lib/testimonials.ts`) standart kontentni ko'rsatadi. Bosilganda ular bazaga ko'chiriladi va shundan keyin baza asosiy manba bo'ladi (hammasi o'chirilsa ham standartga qaytmaydi). Kodda standartni o'zgartirish shundan keyin saytga ta'sir qilmaydi.

## Statistika qanday ishlaydi (maxfiylik)

- O'zimizning hisoblagich: `components/site/tracker.tsx` sahifa ochilganda `/api/t` ga `sendBeacon` yuboradi. **Cookie yo'q; IP va User-Agent bazaga yozilmaydi.** "Tashrifchi" = `sha256(bugungi tasodifiy tuz + IP + UA)` qisqartmasi; tuz har kuni yangilanadi va eskisi o'chiriladi, shuning uchun bir odamni kunlararo bog'lab bo'lmaydi ("tashrifchilar" har kun alohida sanaladi).
- `Do Not Track` / Global Privacy Control yoqilgan brauzerlar hisobga olinmaydi; Sozlamalar'da "Bu qurilmani chiqarish" (`localStorage.ixlos_ignore`).
- Manba: `document.referrer` va `utm_*` birinchi kirishda `sessionStorage`ga yoziladi (birinchi kontakt), har beacon va ariza formasi bilan yuboriladi; server `analytics-shared.ts` orqali manba/kanal (organic/social/ai/referral/campaign) aniqlaydi.
- Robotlar (Googlebot, ChatGPT-User, GPTBot, YandexBot, link ko'rinishlari…) `src/proxy.ts`da so'rov kelganda yoziladi (brauzer skripti ishlatmaydi). Daqiqasiga 120 tagacha.
- Statistika 400 kundan keyin o'chiriladi. `pageviews` faqat `ADMIN_ENABLED=1` joyda yoziladi.

## Arxitektura

| Nima | Qayerda |
|---|---|
| Sahifalar | `src/app/admin/`: `login/` ochiq, `account/`, `(panel)/` guruhi. Har panel sahifasi va amali **`requirePanel()`** bilan boshlanadi (`src/lib/admin/panel.ts`): layout tekshiruvi yetarli emas, chunki Next layout'ni qayta ishga tushirmasdan sahifani render qilishi mumkin |
| Server amallari | Har bo'limda `actions.ts`: **har biri `requirePanel()` bilan boshlanadi**; formalar `useActionState` bilan (`components/admin/form.tsx`: `AdminForm`, `Field`, `SelectField`, `CheckboxField`, xatoda kiritilgan qiymat saqlanadi) |
| Baza | `src/lib/admin/db.ts`: Node'ning o'rnatilgan SQLite'i (`node:sqlite`). Fayl: `DATABASE_PATH` yoki `./data/ixlos.db`. Fayl almashsa (tiklash) handle qayta ochiladi |
| Sxema | `src/lib/admin/schema.mjs`: **faqat oxiriga qo'shiladigan** migratsiyalar (hozir v11). Mavjud yozuvni tahrirlamang |
| Kontent qatlami | `src/lib/content/*` (faq, testimonials, teachers, articles, defaults, order, shared), `src/lib/center.ts`, `src/lib/integrations.ts`, `src/lib/settings.ts` (kalit-qiymat). Jamoat sahifalari o'qishda **hech qachon xato bermaydi**: baza muammo qilsa standart qiymat ishlatiladi |
| Rasmlar | `src/lib/admin/uploads.ts` (sharp: EXIF burish, kesish, WebP, metadata yo'q) → `UPLOAD_DIR`/`<tur>/<tasodifiy>.webp`; `/media/[...path]` beradi (immutable kesh). Server amallari hajmi `next.config.ts`da 12 MB |
| Zaxira | `src/lib/admin/backup.ts` (`VACUUM INTO`, oxirgi 14 ta), `src/instrumentation*.ts` kunlik avtomatik |
| Yoqish belgisi | `ADMIN_ENABLED=1`. O'rnatilmagan joyda (Vercel, oddiy lokal) `/admin` **404** va jamoat sahifalari standart kontent bilan ishlaydi |
| Til middleware'i | `src/proxy.ts`: `admin`, `media`, `api`, fayllar chiqarilgan; robot so'rovlari shu yerda yoziladi |
| Qidiruvdan yopilgan | `robots.ts` (`/admin`), `next.config.ts` (`X-Robots-Tag: noindex`, `no-store`), sahifa metadata'si |

## Xavfsizlik

- Parol: scrypt (N=16384, r=8, p=1) + tuz; `timingSafeEqual`. Minimal uzunlik 12. **Parol hech qachon chatga, repozitoriyga yoki logga yozilmaydi**.
- Sessiya: tasodifiy 32 bayt token, bazada faqat SHA-256 xeshi; 7 kun; cookie `HttpOnly`, `SameSite=Strict`, `Path=/admin`, production'da `Secure`.
- Urinish cheklovi: 15 daqiqada akkaunt+IP uchun 5, IP uchun 20, akkaunt uchun umumiy 50 ta noto'g'ri urinishdan keyin qulf.
- CSRF: Next server action Origin tekshiruvi + `SameSite=Strict`.
- Yuklashlar: fayl **qayta kodlanadi** (kelgan bayt saqlanmaydi), format/hajm/piksel cheklovi, nomlar tasodifiy; `/media` faqat `tur/xesh.webp` ko'rinishini beradi (yo'l hiylalari 404).
- Maqola matni: raw HTML hech qachon o'qilmaydi; havolalar faqat http(s)/mailto/tel/sayt ichidagi yo'l.
- CSV: erkin matn ustunlarida `= + - @` bilan boshlangan qiymatlarga apostrof qo'yiladi.
- Panel shaxsiy ma'lumot saqlaydi (ariza: ism, telefon; zaxira fayllari ham): kuchli parol va HTTPS shart.

## Lokal ishlatish

```bash
echo "ADMIN_ENABLED=1" >> .env.local   # git'ga tushmaydi
npm run admin:create                    # email va parolni so'raydi (parol yashirin)
npm run dev   # http://localhost:3000/admin
```

`data/` (baza, zaxira, yuklashlar) `.gitignore` va `.dockerignore`da. Lokal serverda `TELEGRAM_*` yo'q: sinov arizalari faqat bazaga tushadi. Dev'da (Turbopack) `Bodoni_Moda` shrifti ba'zan yuklanmaydi (build ishlaydi); `next dev --webpack` yordam beradi.

## Serverda ishlatish

Compose'da `ADMIN_ENABLED`, `DATABASE_PATH=/data/ixlos.db`, `ixlos_data` volume'i (egasi uid 1000) bor. Deploy: `docs/deploy.md` (`scripts/deploy-droplet.sh`). Admin yaratish/parolni tiklash:
- Interaktiv: `ssh root@<ip> "docker exec -it ixlos-web node tools/scripts/admin-create.mjs"`.
- Vaqtinchalik parol: `docker exec -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=<tasodifiy> -e ADMIN_MUST_CHANGE=1 ixlos-web node tools/scripts/admin-create.mjs`.

## Zaxira va tiklash

- Panel har kuni `/data/backups/ixlos-YYYYMMDD-HHMMSS.db` nusxasini oladi (oxirgi 14 ta); Sozlamalar'dan qo'lda olish va yuklab olish mumkin. Nusxalar **o'sha diskda**: server darajasidagi zaxira uchun DigitalOcean Backups'ni yoqing.
- Tiklash: `cd /opt/ixlosschool && docker compose stop web`, tanlangan nusxani `ixlos_data` volume'idagi `ixlos.db` ustiga nusxalang (eski `ixlos.db-wal` va `ixlos.db-shm` fayllarni o'chiring), so'ng `docker compose up -d web`. Yuklangan rasmlar `/data/uploads` da alohida turadi va bazaga bog'liq emas.

## Yangi bo'lim qo'shish

1. `schema.mjs`ga migratsiya, `src/lib/content/<nom>.ts` (o'qish standart bilan zaxiralangan, xatoda yiqilmaydi).
2. `src/app/admin/(panel)/<nom>/page.tsx` (`await requirePanel()` bilan boshlanadi) va `actions.ts` (`requirePanel()`), `components/admin/nav.tsx`ga havola.
3. Jamoat sahifasi tayyor tarkibni `src/lib/content/<nom>.ts` orqali o'qisin (sahifalar dinamik, `revalidatePath` kerak emas).

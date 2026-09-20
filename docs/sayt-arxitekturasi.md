# Ixlos School — sayt arxitekturasi

## Maqsad (standing requirement — har doim shu 3 tasiga xizmat qilish kerak)
1. **Ishonch** — maktab sifatli, barqaror, professional brend ekanini isbotlash
2. **Sotuv** — ariza/qo'ng'iroq/Telegram orqali murojaat qildirish (konversiya)
3. **SEO + GEO** — Google'da ham, AI javob motorlarida (ChatGPT, Gemini, Google AI Overview) ham topilish va iqtibos qilinish

Til: **UZ (asosiy) / RU / EN**, har bir sahifa uch tilda ham to'liq bo'lishi kerak — yarim tarjima qilingan sahifa (raqobatchilarda ko'p uchraydigan xato) qat'iyan bo'lmasin.

## URL / i18n struktura
- `/uz/...`, `/ru/...`, `/en/...` — har uchalasi ham prefiks bilan (Next.js App Router: `src/app/[locale]/...`)
- `/` — brauzer tilini aniqlab mos localega redirect, lekin `/uz/...` har doim indekslanadigan default
- Har sahifada `hreflang` alternate teglar (uz/ru/en) + `canonical`
- Slug barcha tillarda **bir xil, inglizcha** (masalan `/uz/admissions`, `/ru/admissions`, `/en/admissions`) — faqat locale prefiks o'zgaradi. Sabab: URL slug tili SEO'da juda kichik omil (asosiysi content/title/schema), lekin bitta slug-set texnik jihatdan soddaroq (3 xil tarjima-mapping saqlash shart emas) va xalqaro-brend pozitsionirovkaga mos (tadqiqotdagi TIS/CIS/Oxbridge kabi xalqaro maktablar ham shu yo'lni tutgan)

## Sahifalar ro'yxati (nav tartibida)

| # | Sahifa | Maqsad | SEO/GEO izoh |
|---|--------|--------|--------------|
| 1 | **Bosh sahifa** `/` | Ishonch + konversiya markazi: hero (aniq taklif+CTA), raqamlarda ishonch (bitiruvchi %, IELTS natija), nega Ixlos School, dastur qisqacha, natijalar, ota-ona video-fikrlari, o'qituvchilar preview, FAQ preview, yakuniy CTA + xarita | `EducationalOrganization` schema, aniq raqamli gaplar (GEO iqtibos uchun) |
| 2 | **Maktab haqida** `/about` | Tarix, litsenziya (nusxa bilan), missiya, bino/infratuzilma (sport zali, IT xona, lab, oshxona) — rasm bilan | "Toshkentda xususiy maktab" kabi brend+lokal so'rovlar uchun asosiy sahifa |
| 3 | **Ta'lim dasturi** `/curriculum` (+ pastki sahifalar: `/curriculum/grades-1-4`, `/curriculum/grades-5-9`, `/curriculum/grades-10-11`) | Har bosqich uchun fanlar, soat/hafta, metodikalar (Yaponiya/Peterson, Prompt Engineering, Edu Bum, 100 ballik), A/B/C guruh tizimi | Har pastki sahifa o'z kalit so'zi bilan alohida reytingga chiqadi — bitta uzun sahifadan ko'ra kuchliroq |
| 4 | **To'garaklar** `/clubs` | Mental arifmetika, Shaxmat, Arab tili, Robototexnika, IT, Logoped, Football, Dzyudo — sinf va narx (bepul) bilan | "bolalar uchun shaxmat to'garagi Toshkent" kabi long-tail so'rovlar |
| 5 | **Qabul** `/admissions` | **Eng yuqori konversiya sahifasi**: bosqichma-bosqich jarayon (vizual stepper), imtihon/suhbat, hujjatlar, narx jadvali, chegirma/stipendiya shartlari, onlayn ariza formasi | Narx shaffofligi — raqobatchilarning aksariyati buni yashiradi, ochiq ko'rsatish ishonch+SEO uchun ham kuchli signal |
| 6 | **Natijalar** `/results` | Statistika (manba bilan), bitiruvchilar qaysi oliygohga kirgan, sertifikat/diplom galereyasi, olimpiada natijalari | Aniq faktlar (yil, son, diplom) — GEO uchun eng qimmatli kontent turi |
| 7 | **O'qituvchilar** `/teachers` | Direktor + 8-10 asosiy o'qituvchi: rasm, F.I.Sh., fan, tajriba, sertifikat | `Person` schema, E-E-A-T (expertise) signali — Google va AI ikkalasi uchun ham muhim |
| 8 | **Kundalik hayot** `/school-life` | Dars vaqti, ovqatlanish, transport (school bus), xavfsizlik, forma | Amaliy savollarga javob — ota-onaning "qo'shimcha xarajat/tashvish"ini yopadi |
| 9 | **Ota-onalar fikri** `/testimonials` (+ homepage'da preview) | 3-5 video/matnli fikr, ism + farzand sinfi bilan | `Review`/video schema — real ism-sinf bilan berilgan fikr ishonchni oshiradi |
| 10 | **Blog / Yangiliklar** `/blog` | Tadbirlar, o'quv maslahatlari, maktab yangiliklari — muntazam yuritiladigan | Raqobatchilarning deyarli barchasi buni tashlab qo'ygan (tadqiqotda aniqlandi) — bu **uzoq muddatli SEO ustunligi** olish imkoniyati |
| 11 | **Savol-javob** `/faq` | 10 ta ko'p so'raladigan savol + javob (narx, hujjat, ovqat, transport va h.k.) | `FAQPage` schema — GEO/Answer Engine Optimization uchun eng muhim sahifalardan biri, AI motorlar to'g'ridan-to'g'ri shu formatdan iqtibos oladi |
| 12 | **Aloqa** `/contact` | To'liq manzil, telefon, Telegram/Instagram, ish vaqti, Google/Yandex xarita | `LocalBusiness`/`EducationalOrganization` NAP (Name-Address-Phone) — Google Business Profile, 2GIS, Golden Pages'dagi ma'lumot bilan **so'zma-so'z mos** bo'lishi shart (GEO uchun entity-consistency asosiy omil) |

Asosiy menyu (header, 6-7 band, UX uchun cheklangan): Bosh sahifa · Maktab haqida · Ta'lim dasturi · Natijalar · O'qituvchilar · Qabul (ajratilgan CTA tugma) · Aloqa.
Footer'da: Blog, Savol-javob, Fikrlar, To'garaklar, ijtimoiy tarmoqlar, litsenziya raqami.
Butun sayt bo'ylab: sticky/floating qo'ng'iroq + Telegram tugmasi (O'zbekiston bozorida forma emas, aynan shu ikkisi asosiy konversiya kanali — tadqiqotda tasdiqlangan).

## SEO/GEO — har bir sahifada majburiy standart (workflow qoidasi)
- **Schema.org JSON-LD**: bosh sahifada `EducationalOrganization` + `LocalBusiness`; savol-javobda `FAQPage`; o'qituvchilarda `Person`; blogda `Article`; barcha sahifada `BreadcrumbList`
- **Aniq, iqtibos qilinadigan gaplar** — "juda yaxshi natijalar" emas, "2025-yilda bitiruvchilarning 85%i IELTS'dan 6.5+ ball oldi" kabi raqam+yil+manba
- **NAP consistency** — manzil/telefon sayt, Google Business, 2GIS, Golden Pages'da bir xil yozilishi
- **`sitemap.xml` + `robots.txt`** avtomatik generatsiya (next-sitemap)
- **OpenGraph + Twitter card** har sahifada (ijtimoiy tarmoqda ulashganda ko'rinishi uchun)
- **next/image** orqali rasm optimizatsiyasi, video lazy-load — Core Web Vitals
- **Mobile-first** — O'zbekistonda trafikning aksariyati telefondan
- **`llms.txt`** (ildizda) — sayt haqida AI crawler'lar uchun strukturaviy qisqa xulosa (yangi, lekin GEO uchun o'sib borayotgan amaliyot)
- Har yangi sahifa/matn tayyor bo'lganda ushbu ro'yxat bilan tekshirilsin

## Qurish tartibi (mavjud ma'lumotga qarab, bosqichma-bosqich)
Hozirda eng to'liq ma'lumot: **Ta'lim dasturi** (qisman) va **Kundalik hayot** — shu ikkitasidan boshlash mumkin. **O'qituvchilar, Natijalar, Aloqa, Media (rasm/video), Marketing (FAQ/sabab)** bo'limlari uchun asoschilardan ma'lumot hali kerak (oldingi solishtiruvga qarang) — bu sahifalar tuzilmasi tayyor bo'ladi, lekin kontent kelgach to'ldiriladi.

## Bosh sahifa (`/`) — tasdiqlangan dizayn: "Bayon"
Mijoz tomonidan tanlangan (dizayn nomi: Bayon — dadil tipografika, yashil panel + xantal iqtibos-karta). Kod: `src/components/site/`, matnlar: `messages/{uz,ru,en}.json`.

Bo'limlar ketma-ketligi: Header (til almashtirgich + mobil menyu) → Hero (yashil panel, iqtibos-karta, mundarija, bosqichlar lentasi) → Faktlar → Nega biz → Ta'lim dasturi → Kundalik hayot ("9 soat") → To'garaklar → Savol-javob (FAQPage schema) → Ariza formasi (`/api/apply`) → Footer.

Hali qo'shilmagan (ma'lumot kelgach): o'qituvchilar, natijalar/statistika, ota-onalar fikri, aloqa/xarita, real fotosuratlar. Soxta ism/raqam/vaqt qo'yilmaydi.

## Qurilgan ichki sahifalar va SEO/GEO infratuzilmasi (2026-09)
**Sahifalar (UZ/RU/EN, slug hamma tilda bir xil):** `/` · `/admissions` (qabul tartibi: 6 blok + ariza formasi) · `/privacy` (maxfiylik siyosati — yuridik tekshiruv kerak). Noma'lum yo'l → 404 (tilga mos sahifa, `noindex`).

**Har sahifada:** `canonical` + `hreflang` (uz/ru/en/x-default) → `src/lib/seo.ts` `buildMetadata()`; OpenGraph/Twitter (`public/og/og-{uz,ru,en}.png`, 1200×630); JSON-LD `@graph` (School, WebSite, WebPage, BreadcrumbList; bosh sahifada `FAQPage`) → `src/components/site/json-ld.tsx`. Yangi sahifa qo'shilganda `src/app/sitemap.ts` dagi `pages` ro'yxatiga ham qo'shilsin.

**Sayt darajasida:** `sitemap.xml` (har URL uchun til alternativlari), `robots.txt` (`/api/` yopiq; GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended ochiq ruxsat), `public/llms.txt`, `manifest.webmanifest`, favicon/ikonkalar (`src/app/icon.svg`, `apple-icon.png`, `favicon.ico`, `public/icons/`). `/logo` — `noindex`.

**Ariza formasi → Telegram:** `src/app/api/apply/route.ts` (zod, honeypot, IP bo'yicha limit: 10 daqiqada 5 ta). Production'da `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` bo'lmasa 503 qaytaradi (ariza yo'qolib qolmasligi uchun); dev'da jim o'tadi. Muvaffaqiyatda `trackLead()` → GA `generate_lead` / Yandex `reachGoal("lead")`.

**Muhit o'zgaruvchilari** (`.env.example`): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID`, `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION`.

**Hali tasdiqlanmagan (soxta yozilmaydi):** shahar ("Toshkent" — hero va meta'da bor, tasdiq kerak), manzil/telefon/ijtimoiy tarmoq (`School` schema'da `address`/`telephone`/`sameAs` yo'q — kelgach qo'shiladi va NAP hamma joyda bir xil bo'lsin), litsenziya raqami.

## Ustozlar (`/teachers` + bosh sahifadagi bo'lim)
**Ma'lumot manbai:** `src/lib/teachers.ts` (tuzilmali; faqat maktab bergan faktlar). Til bo'yicha o'zgaradigan matnlar (universitet nomlari, yorliqlar) `messages/*.json` → `teachers`. RU sahifada ismlar kirillcha (`nameRu`). Tartib: ish staji bo'yicha (ko'pdan kamga), ma'lumoti yo'qlar oxirida. Yangi ustoz yoki yangi ma'lumot kelganda `teachers.ts` va (yangi rasm bo'lsa) `public/teachers/site/` yangilanadi. Asl rasmlar/ma'lumotlar (`teachers/`, `info/`) repo ochiq bo'lgani uchun git'ga qo'shilmaydi (`.gitignore`).
**Rasmlar:** `public/teachers/site/<slug>.jpg` — 800×1000, yuz aniqlash bilan bir xil o'lchamda qirqilgan (asl fayllar lokal `teachers/` papkada).
**Bosh sahifa:** rasm ustida ma'lumot beruvchi kartalar gorizontal cheksiz oqimda (o'ngdan chapga, CSS animatsiya). Sichqoncha ustiga borsa to'xtaydi; tegilganda/sudralganda/gorizontal scroll qilinganda/Tab bosilganda oddiy scroll'ga o'tadi (joyi o'zgarmaydi), 8 soniya tegilmasa yana oqadi. `prefers-reduced-motion`da oqim yo'q. Kod: `teachers-carousel.tsx`, `teacher-slide.tsx`.
**/teachers:** grid; ism rasm ustida, ma'lumotlar ikonkali ro'yxatda (`teacher-card.tsx`). `Person` + `ItemList` JSON-LD. Ustoz qo'shilganda `sitemap.ts` o'zgartirilmaydi (bitta sahifa).

**Domen:** asosiy host `https://www.ixlosschool.uz` (Vercel'da `ixlosschool.uz` → `www` ga 308). `SITE_URL` (`src/lib/seo.ts`), sitemap, canonical, hreflang, `llms.txt` shu host bilan yozilgan; host o'zgarsa hammasini birga o'zgartirish kerak.

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

Qo'shildi: o'qituvchilar, natijalar (IELTS/SAT/onlayn matematika olimpiadasi), aloqa (footer). Video-fikrlar qo'shildi (pastdagi "Video-fikrlar" bo'limiga qarang). Hali qo'shilmagan (ma'lumot kelgach): xarita, o'quv narxi, litsenziya raqami. Soxta ism/raqam/vaqt qo'yilmaydi.

## Qurilgan ichki sahifalar va SEO/GEO infratuzilmasi (2026-09)
**Sahifalar (UZ/RU/EN, slug hamma tilda bir xil):** `/` · `/admissions` (qabul tartibi: 6 blok + ariza formasi) · `/teachers` (ustozlar) · `/results` (natijalar) · `/contact` (aloqa, manzil, maktab bir qarashda) (maxfiylik siyosati sahifasi egasi qaroriga ko'ra olib tashlangan; ariza formasi ham unga havola qilmaydi). Noma'lum yo'l → 404 (tilga mos sahifa, `noindex`).

**Har sahifada:** `canonical` + `hreflang` (uz/ru/en/x-default) → `src/lib/seo.ts` `buildMetadata()`; OpenGraph/Twitter (`public/og/og-{uz,ru,en}.png`, 1200×630); JSON-LD `@graph` (School, WebSite, WebPage, BreadcrumbList; bosh sahifada `FAQPage`) → `src/components/site/json-ld.tsx`. Yangi sahifa qo'shilganda `src/app/sitemap.ts` dagi `pages` ro'yxatiga ham qo'shilsin.

**Sayt darajasida:** `sitemap.xml` (har URL uchun til alternativlari), `robots.txt` (`/api/` yopiq; GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended ochiq ruxsat), `public/llms.txt`, `manifest.webmanifest`, favicon/ikonkalar (`src/app/icon.svg`, `apple-icon.png`, `favicon.ico`, `public/icons/`). `/logo` — `noindex`.

**Ariza formasi → Telegram:** `src/app/api/apply/route.ts` (zod, honeypot, IP bo'yicha limit: 10 daqiqada 5 ta). Production'da `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` bo'lmasa 503 qaytaradi (ariza yo'qolib qolmasligi uchun); dev'da jim o'tadi. Muvaffaqiyatda `trackLead()` → GA `generate_lead` / Yandex `reachGoal("lead")`.

**Muhit o'zgaruvchilari** (`.env.example`): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID`, `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION`.

**Hali tasdiqlanmagan (soxta yozilmaydi):** o'quv narxi (summalar berildi — 1–4: 5 900 000, 5–8: 6 200 000, 9–11: 6 500 000, tayyorlov: 4 900 000; oylik/yarim yillik/yillik to'lov mumkin — lekin bu summa yillik jamimi yoki oylik to'lovning o'zimi, aniqlashtirish kerak, shu sabab saytga hali chiqarilmagan), litsenziya raqami. Manzil/telefon/ijtimoiy tarmoq va "Toshkent" endi tasdiqlangan (pastga qarang).

## Ustozlar (`/teachers` + bosh sahifadagi bo'lim)
**Ma'lumot manbai:** `src/lib/teachers.ts` (tuzilmali; faqat maktab bergan faktlar). Til bo'yicha o'zgaradigan matnlar (universitet nomlari, yorliqlar) `messages/*.json` → `teachers`. RU sahifada ismlar kirillcha (`nameRu`). Tartib: ish staji bo'yicha (ko'pdan kamga), ma'lumoti yo'qlar oxirida. Yangi ustoz yoki yangi ma'lumot kelganda `teachers.ts` va (yangi rasm bo'lsa) `public/teachers/site/` yangilanadi. Asl rasmlar/ma'lumotlar (`teachers/`, `info/`) repo ochiq bo'lgani uchun git'ga qo'shilmaydi (`.gitignore`).
**Rasmlar:** `public/teachers/site/<slug>.jpg` — 800×1000, yuz aniqlash bilan bir xil o'lchamda qirqilgan (asl fayllar lokal `teachers/` papkada).
**Bosh sahifa:** rasm ustida ma'lumot beruvchi kartalar gorizontal cheksiz oqimda (o'ngdan chapga, CSS animatsiya). Sichqoncha ustiga borsa to'xtaydi; tegilganda/sudralganda/gorizontal scroll qilinganda/Tab bosilganda oddiy scroll'ga o'tadi (joyi o'zgarmaydi), 8 soniya tegilmasa yana oqadi. `prefers-reduced-motion`da oqim yo'q. Kod: `teachers-carousel.tsx`, `teacher-slide.tsx`.
**/teachers:** grid; ism rasm ustida, ma'lumotlar ikonkali ro'yxatda (`teacher-card.tsx`). `Person` + `ItemList` JSON-LD. Ustoz qo'shilganda `sitemap.ts` o'zgartirilmaydi (bitta sahifa).

## Natijalar (`/results` + bosh sahifadagi bo'lim)
**Ma'lumot manbai:** `23.09/natijalar/` (asl rasmlar, git'ga qo'shilmaydi) → qayta ishlangan holda `public/results/` ga joylandi, ro'yxati `src/lib/results.ts` da. Har rasmning o'zida ism/ball/sertifikat matni chizilgan (maktab tayyorlagan tayyor grafika) — kod ularni qayta terib chiqmaydi, faqat tartiblab ko'rsatadi. 5 toifa: **featured** (4 ta — talaba rasmi + IELTS ball, bosh sahifada ko'rinadi), **ielts** (6), **olympiad** (8, onlayn matematika olimpiadasida ishtirok sertifikatlari, 5–6-sinf), **sat** (3), **cefr** (1). Bosh sahifada faqat `featured` 4 tasi + "Barcha natijalar" tugmasi (`/results`); to'liq sahifada hammasi toifalarga bo'lib ko'rsatiladi. Yangi natija kelsa: rasmni `23.09/natijalar/`ga qo'yib ayting — men `public/results/`ga optimallashtirib, `results.ts`ga qo'shaman.

## Pozitsiyalash: "Moliya va IT" (2026-09)
Maktab o'z Instagramida "Moliya va IT yo'nalishiga ixtisoslashgan maktab" deydi — hero (`hero.leadStrong`), sahifa sarlavhasi/tavsifi (`meta.*`), manifest va `llms.txt` shu iborada. Chuqurlashtirilgan o'qitish (matematika, ingliz tili, informatika) faqat **5–9-sinflar** uchun tasdiqlangan (asosiy hujjat) — uni hamma sinfga tegishli qilib yozmaslik kerak; dastur bo'limlari (`whyUs`, `curriculum`) aynan shunday yozilgan. Diplom nomi hujjatda "Buxgalteriya" — maktab boshqacha demaguncha o'zgartirilmaydi.

## SEO/GEO texnik qatlam (2026-09)
- **Sarlavha/tavsif qoidasi:** title ≤ 60, description ≤ 160 belgi, har sahifada noyob, kalit so'z + joylashuv ("Yunusobod, Toshkent"); matnlar `messages/*.json` → `meta`, `pages.*.metaTitle/metaDescription`. Yangi sahifa qo'shilganda shu uzunlik tekshiriladi.
- **Meta teglar (`src/app/[locale]/layout.tsx`):** `robots` + `googlebot` (`max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1`), `keywords` (`messages seo.keywords`; Google/Yandex ular hisobga olmaydi, Bing uchun zarar qilmaydi), `creator/publisher/category`, `referrer` (YouTube embed uchun `strict-origin-when-cross-origin` shart), `geo.region=UZ-TK`, `geo.placename=Tashkent`. 404 sahifasi o'zining `noindex`ini beradi (Next nested metadata'ni to'liq almashtiradi).
- **JSON-LD:** `School` (address, `contactPoint` x2, `founder`, `knowsAbout`, `amenityFeature`, `sameAs` Telegram/Instagram/YouTube); bosh sahifada 3 ta `Course` (5–9-sinf chuqurlashtirilgan fanlar, Buxgalteriya, IT — narx/offer yo'q), 5 ta `VideoObject`, `FAQPage` (10 savol: takrorlar birlashtirilgan, GEO uchun yetarli; yangi mavzu kelsa shu ro'yxatga ortiqcha qo'shmang, blogga qo'ying); `/contact` da `ContactPage`. Matnlar `messages seo.*`da, kod `src/lib/seo.ts`.
- **HTTP sarlavhalar (`next.config.ts`):** `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`; `poweredByHeader` o'chirilgan; rasmlar AVIF/WebP.
- **Ochiq qolgan:** `openingHoursSpecification` (kunlar noma'lum), `geo`/`hasMap` (koordinata/mo'ljal kerak), narx/`Offer` (qaror kutilmoqda).
- **Ikonkalar va ulashish rasmlari:** tab/qidiruv favicon'i "IS" monogrammasi (Bodoni Moda 800, yashil kvadrat, oq harflar; 16 pikselda ham o'qiladi): `src/app/icon.svg`, `favicon.ico` (16/32/48), `icon1.png` (48), `icon2.png` (96); Google 48 ga karrali o'lcham yoki SVG so'raydi. Katta ikonkalarda gerb (crest) qoladi: `apple-icon.png` (180, shaffofliksiz, burchaksiz kvadrat, aks holda iOS qora burchak beradi), `public/icons/icon-192|512.png` va PWA "maskable" uchun `icon-maskable-512.png`. Ulashish rasmlari `public/og/og-{uz,ru,en}.png` hero matnidan `scripts/generate-og-images.mjs` bilan yaratiladi (matn o'zgarsa qayta ishga tushiring; playwright-core va Chrome kerak). Favicon'ni Google uzoq keshlaydi: tez-tez almashtirmang.
- **Kalit so'zlar va blog:** 26 ta so'rov (13 SEO + 13 GEO) → postlar xaritasi `docs/blog-reja.md`da.
- **Narx:** yuqoridagi jadvalda narx shaffofligi tavsiya qilingan, lekin maktab hozircha e'lon qilmaslikni tanlagan — bu Toshkent/Yunusobod/Ixlos narx so'rovlarida sayt chiqmasligini bildiradi; qaror o'zgarsa `/admissions` va FAQ'ga narx jadvali qo'shiladi.

## Video-fikrlar (bosh sahifa + `/results`)
Maktabning rasmiy YouTube kanalidagi 5 ta Shorts (ota-ona fikri, ingliz tili natijalari, Xpert musobaqasi g'olibi / Amerika yo'llanmasi, 9-sinf o'quvchisi IELTS 8.0, bir necha universitetdan grant yutgan o'quvchi). Ro'yxat va yuklangan sanalar (kanal feed'idan olingan, taxminiy emas) — `src/lib/testimonials.ts`; sarlavha/izohlar `messages/*.json` → `testimonials.items.<key>`. Videolar o'zbek tilida bo'lgani uchun JSON-LD'da `inLanguage: "uz"`.

**Joylashuvi:** bosh sahifada "Natijalar"dan keyin, "To'garaklar"dan oldin (raqamlar/sertifikatlardan keyin — jonli ovoz); `/results` sahifasida galereyadan keyin, ariza formasidan oldin. To'q yashil (`brand-feature`) to'liq kenglikdagi band — och bo'limlar orasida ritm beradi. Mobil/planshet (<1280px): snap-scroll lenta (keyingi karta "ko'rinib turadi", ≥768px da strelkalar), 1280px+ da 5 ustunli setka. Karta bosilganda: to'liq ekranli `<dialog>` (Esc, orqa fonga bosish, ← → tugmalari, oldingi/keyingi, "YouTube'da ochish", "Ariza qoldirish" → `#ariza`) va faqat shunda `youtube-nocookie.com` iframe yuklanadi (sahifa tezligi uchun oldindan yuklanmaydi). Kartalardagi rasmlar — `public/testimonials/` (YouTube thumbnail'dan 9:16 kesilgan).

**SEO:** har bir video uchun `VideoObject` (`src/lib/testimonials-ld.ts`; `embedUrl`, `thumbnailUrl`, `uploadDate`). YouTube kanali `School.sameAs` da va footer'da. Yangi video qo'shish: thumbnail'ni `public/testimonials/`ga, yozuvni `testimonials.ts` va 3 tildagi `messages`ga qo'shing.

## Aloqa (footer + JSON-LD)
Manzil, telefon (x2), ish vaqti, Telegram, Instagram, YouTube (`https://www.youtube.com/@IXLOSMAKTAB`) — `src/lib/contact.ts` da bitta joyda (NAP hamma yerda bir xil bo'lishi uchun). Footer'da (manzil `<address>` ichida) va `/contact` sahifasida (kartalar, Google/Yandex xarita havolalari, "Ixlos School bir qarashda" fakt jadvali `school-facts.tsx`) ko'rinadi; header'ga qo'shilmagan (menyu to'la); `School` JSON-LD'da `address`/`telephone`/`sameAs` sifatida ham bor. Ish kunlari (haftaning qaysi kunlari) berilmagani uchun `openingHoursSpecification` qo'shilmadi — faqat matn sifatida "08:00–18:00".

**Domen:** asosiy host `https://www.ixlosschool.uz` (Vercel'da `ixlosschool.uz` → `www` ga 308). `SITE_URL` (`src/lib/seo.ts`), sitemap, canonical, hreflang, `llms.txt` shu host bilan yozilgan; host o'zgarsa hammasini birga o'zgartirish kerak.

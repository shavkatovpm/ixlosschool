# Ixlos School — admin panel

> **Holat (2026-09-24):** poydevor va "Arizalar" bo'limi tayyor va lokalda sinalgan; **serverga hali joylanmagan** (egasi "deploy" demagan). Boshqa bo'limlar rejada (pastga qarang). Bitta super-admin yetarli: foydalanuvchilar/rollar va imtihon jadvali egasi qaroriga ko'ra **chiqarib tashlangan**.

## Nima bor

- **Kirish:** `/admin/login` (email + parol). Sayt tilidan mustaqil (til prefiksi yo'q, o'zbekcha interfeys).
- **Bosh sahifa** (`/admin`): yangi/bugun/7 kun/jami arizalar, holatlar bo'yicha sonlar, oxirgi arizalar.
- **Arizalar** (`/admin/leads`): holat bo'yicha filtr, ism/telefon/izoh bo'yicha qidiruv, har ariza uchun holat + izoh saqlash, CSV yuklash (`/admin/leads/export`, Excel uchun UTF-8 BOM bilan).
- **Hisob** (`/admin/account`): email va parolni o'zgartirish (joriy parol talab qilinadi; o'zgargach boshqa sessiyalar tugatiladi). Vaqtinchalik parol bilan yaratilgan hisob (`ADMIN_MUST_CHANGE=1`) birinchi kirishda **faqat shu sahifaga** o'tkaziladi va yangi parol o'rnatmaguncha panelning boshqa joyiga kira olmaydi.
- Holatlar: Yangi, Qo'ng'iroq qilindi, Imtihonga yozildi, Qabul qilindi, Rad etildi (`src/lib/admin/leads.ts`).
- Saytdagi forma (`/api/apply`) arizani Telegram'ga yuborishdan **oldin** bazaga yozadi (faqat panel yoqilgan joyda). Telegram ishlamasa ham ariza yo'qolmaydi va foydalanuvchiga muvaffaqiyat qaytadi.

## Rejadagi bo'limlar (tartib bilan)

1. Sozlamalar (telefon, manzil, ish vaqti, analitika ID'lari, tasdiqlash kodlari).
2. Blog muharriri (UZ/RU/EN, title ≤ 60 / description ≤ 160 hisoblagichi, slug, rasm, chop etish sanasi), FAQ, ustozlar, natijalar, video fikrlar.
3. Narxlar moduli (kiritiladi, saytda faqat "ko'rsat" deganda chiqadi), SEO boshqaruvi (sahifa title/description, redirect), statistika.
Har matn uch tilda to'ldirilmasa saqlanmaydi (loyihaning standing qoidasi).

## Arxitektura

| Nima | Qayerda |
|---|---|
| Sahifalar | `src/app/admin/` (o'z root layout'i, `[locale]`dan tashqarida). `login/` ochiq, `(panel)/` guruhi `requireAdmin()` bilan himoyalangan |
| Server amallari | `src/app/admin/actions.ts` (`loginAction`, `logoutAction`, `updateLeadAction`). **Har bir yozuvchi amal `requireAdmin()` bilan boshlanishi shart** |
| Baza | `src/lib/admin/db.ts`: Node'ning o'rnatilgan SQLite'i (`node:sqlite`, Node ≥ 22.13; native modul yo'q, shuning uchun serverga qo'shimcha binar jo'natish kerak emas). Fayl: `DATABASE_PATH` yoki `./data/ixlos.db` |
| Sxema | `src/lib/admin/schema.mjs`: **faqat oxiriga qo'shiladigan** migratsiyalar (mavjud yozuvni tahrirlamang, yangisini qo'shing). `schema.mjs` va `password.mjs` CLI bilan umumiy |
| Kirish/sessiya | `src/lib/admin/auth.ts` |
| Arizalar | `src/lib/admin/leads.ts` |
| Yoqish belgisi | `ADMIN_ENABLED=1` (`src/lib/admin/config.ts`). O'rnatilmagan joyda (Vercel, oddiy lokal) `/admin` **404** |
| Til middleware'idan chiqarilgan | `src/proxy.ts` matcher'ida `admin` |
| Qidiruvdan yopilgan | `robots.ts` (`/admin`), `next.config.ts` (`X-Robots-Tag: noindex`, `Cache-Control: no-store`), sahifa metadata'si |

## Xavfsizlik

- Parol: scrypt (N=16384, r=8, p=1) + tasodifiy tuz; taqqoslash `timingSafeEqual`. Minimal uzunlik 12. **Parol hech qachon chatga, repozitoriyga yoki logga yozilmaydi** (CLI uni yashirin kiritishni so'raydi).
- Sessiya: tasodifiy 32 bayt token cookie'da, bazada faqat SHA-256 xeshi; 7 kun; cookie `HttpOnly`, `SameSite=Strict`, `Path=/admin`, production'da `Secure`.
- Urinish cheklovi: 15 daqiqada akkaunt+IP uchun 5, IP uchun 20, akkaunt uchun umumiy 50 ta noto'g'ri urinishdan keyin qulf. IP `x-forwarded-for`ning birinchi qiymatidan (Caddy uni o'zi yozadi).
- CSRF: Next server action'larining Origin tekshiruvi + `SameSite=Strict`. CSV: erkin matn ustunlarida (ism, izoh) `= + - @` bilan boshlanadigan qiymatlar formulaga aylanmasligi uchun apostrof qo'yiladi.
- Panel shaxsiy ma'lumot saqlaydi (ota-ona ismi, telefon): serverga HTTPS'dan boshqa yo'l bilan kirish yo'q, zaxira nusxa va kirish himoyasi (kuchli parol) shart.

## Lokal ishlatish

```bash
echo "ADMIN_ENABLED=1" >> .env.local   # .env.local git'ga tushmaydi; dev server o'zi qayta yuklaydi
npm run admin:create                    # email va parolni so'raydi (parol yashirin)
# http://localhost:3000/admin
```

`data/` papkasi (lokal baza) `.gitignore` va `.dockerignore`da. Lokal serverda `TELEGRAM_*` yo'q, shuning uchun sinov arizalari Telegram'ga bormaydi, faqat bazaga tushadi.

## Serverda yoqish (deploy bosqichi)

1. `/opt/ixlosschool/docker-compose.yml`ga: `environment`ga `ADMIN_ENABLED: "1"` va `DATABASE_PATH: /data/ixlos.db`, `volumes`ga `- ixlos_data:/data`, pastdagi `volumes:` bo'limiga `ixlos_data:`.
2. Volume egasini konteyner foydalanuvchisiga (uid 1000) berish: `docker run --rm -v ixlos_ixlos_data:/data busybox chown 1000:1000 /data`.
3. Deploy: `scripts/deploy-droplet.sh` (u `tools/scripts/admin-create.mjs` ni ham release'ga qo'shadi).
4. Admin yaratish. Ikki usul:
   - **Interaktiv** (parolni o'zingiz yashirin kiritasiz): `ssh root@<droplet-ip> "docker exec -it ixlos-web node tools/scripts/admin-create.mjs"`.
   - **Vaqtinchalik parol** (egasi terminal ishlatmasa): `docker exec -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=<tasodifiy> -e ADMIN_MUST_CHANGE=1 ixlos-web node tools/scripts/admin-create.mjs`; parol egasiga bir marta beriladi va birinchi kirishda majburan almashtiriladi.
   Parolni unutsangiz shu buyruq bilan qayta o'rnatiladi (barcha sessiyalar tugatiladi).
5. `https://www.ixlosschool.uz/admin` orqali kirish.

## Zaxira nusxa (backup) — majburiy

Baza `ixlos_ixlos_data` volume'idagi bitta fayl. Serverda hali zaxira yo'q. Tavsiya: DigitalOcean Backups **va** kunlik nusxa (`VACUUM INTO '/data/backups/ixlos-YYYYMMDD.db'`, oxirgi 14 ta saqlanadi; `docker exec ixlos-web node -e ...` yoki host cron). Nusxa qo'yilmaguncha arizalar faqat shu diskda turadi (Telegram ularning ikkinchi nusxasi vazifasini bajaradi).

## Yangi bo'lim qo'shish

1. `schema.mjs`ga yangi migratsiya (jadval), `src/lib/admin/<nom>.ts`da so'rovlar.
2. `src/app/admin/(panel)/<nom>/page.tsx` va `(panel)/layout.tsx`dagi `nav` ro'yxatiga havola.
3. Yozuvchi amallar `actions.ts`da, `requireAdmin()` bilan boshlanadi va `revalidatePath` chaqiradi.
4. Saytning ochiq sahifalari DB'dan o'qiydigan bo'lsa: saqlagandan keyin tegishli sahifalar `revalidatePath` bilan yangilansin.

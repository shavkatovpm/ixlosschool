# Ixlos School — deploy workflow

> **Holat: vaqtinchalik.** Hozir sayt Vercel'da turibdi; keyinroq DigitalOcean droplet'ga ko'chiriladi. Ko'chirgandan keyin shu faylni yangilang (pastdagi "Droplet'ga ko'chish" bo'limiga qarang). Oxirgi yangilanish: 2026-09-24.

## Qisqacha

- **Kod:** GitHub `shavkatovpm/ixlosschool`, branch `main`.
- **Hosting:** Vercel, project `shavkatovs-projects/ixlosschool`. Lokal ulanish `.vercel/` papkasida (gitignored).
- **Deploy = `git push origin main`.** Vercel'ning GitHub integratsiyasi `main`ga har bir push'da production build va deploy qiladi (~30 soniya). Boshqa deploy skripti yo'q; preview/staging muhiti ham yo'q, har deploy production.
- **Domen:** asosiy host `https://www.ixlosschool.uz` (`SITE_URL` shu, `src/lib/seo.ts`). `ixlosschool.uz` Vercel domen sozlamasida `www`ga yo'naltiriladi. Root `/` brauzerni `/uz`ga yuboradi (`src/proxy.ts`, next-intl).
- **Stack:** Next.js 16 (Turbopack), React 19, Tailwind v4, next-intl (UZ default / RU / EN). `npm run build` = `next build`, `npm start` = `next start`. `@vercel/*` paketlari ishlatilmaydi, kod Vercel runtime'iga bog'liq emas.

## Qoidalar (kim va qachon deploy qiladi)

1. **Faqat egasi aniq "deploy" desa** push qilinadi. Codex bilan UI ishlari parallel ketishi mumkin: yarim tayyor ish chiqib ketmasin.
2. `main`ga to'g'ridan-to'g'ri push (PR jarayoni yo'q). Force-push yo'q, hook'lar o'tkazib yuborilmaydi (`--no-verify` yo'q).
3. **Repozitoriy ochiq (public).** Xom manba papkalari `.gitignore`da: `/teachers/`, `/info/`, `/23.09/`, `/1 kun/`, `/Owner/`. `.env*` (faqat `.env.example` dan tashqari), token va parollar hech qachon commit qilinmaydi.
4. Codex va Claude bitta ishchi papkada ishlaydi: fayl tahrirlashdan oldin uni qayta o'qing (boshqasi o'zgartirgan bo'lishi mumkin), o'zgarishlarni kichik va aniq qiling.

## Deploydan oldin tekshiruv (hammasi o'tishi shart)

```bash
npx tsc --noEmit
npx eslint .
```

Keyin production build **alohida nusxada** (bir papkada `next build` ishlayotgan `next dev`ning `.next` papkasini buzadi):

```bash
COPY=$(mktemp -d)
rsync -a --exclude /node_modules --exclude /.next --exclude /.git --exclude /.vercel \
  --exclude /Owner --exclude /teachers --exclude /info --exclude /23.09 --exclude "/1 kun" --exclude /.claude \
  ./ "$COPY/"
cp -Rc node_modules "$COPY/node_modules"   # macOS/APFS: deyarli bir zumda. Linux: cp -R --reflink=auto
cd "$COPY" && npx next build; echo "exit: $?"
```

- `--exclude` **boshida `/` bilan** yozilishi shart. `--exclude teachers` deb yozilsa `src/app/[locale]/teachers` va `public/teachers` ham tushib qoladi va build "o'tib" ketadi, lekin sahifa yo'q bo'ladi.
- Kutilgan natija: `exit: 0`, statik sahifalar (hozir 25 ta): `/uz`, `/ru`, `/en` va har biri uchun `admissions`, `contact`, `results`, `teachers`. Sahifa qo'shilsa/olinsa bu son o'zgaradi.
- `next/font/google` (Geist, Manrope, Bodoni Moda) build paytida internetdan yuklaydi: build uchun tarmoq kerak.
- Route o'chirilsa yoki nomi o'zgarsa, dev'ning `.next/types` papkasi eskirib qoladi va `tsc` yiqiladi. Yechim: `npx next typegen`, so'ng eski `.next/types/app/[locale]/<eski-yo'l>` papkasini o'chirish.
- Yangi matn `messages/uz.json`, `ru.json`, `en.json` uchalasida ham bo'lishi kerak. Sahifa title ≤ 60, description ≤ 160 belgi.
- Sir-tekshiruv (staged diff ichida token/kalit yo'qligiga ishonch hosil qiling):

```bash
git diff --cached | grep -n -i -E "[0-9]{8,}:AA[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (RSA|PRIVATE)|password\s*[:=]"
```

## Commit va push

```bash
git add .gitignore docs messages public scripts src next.config.ts   # aniq yo'llar; `git add -A` emas
git status --short                                                    # xom fotolar, .env tushmaganini ko'ring
git commit -F - <<'EOF'
Add <nima qilindi> (inglizcha, buyruq shaklida, ~70 belgigacha)

- qisqa punktlar: nima va nega

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
git push origin main
```

Trailer faqat Claude ishtirok etgan commit'larda. Commit sarlavhasi uslubi: "Add 3D illustrations to the clubs section", "Stop the page from jumping while scrolling on phones and tablets".

## Deploy holatini kuzatish

`gh` (GitHub CLI) bu kompyuterda **login qilinmagan**, shuning uchun GitHub commit status API ishlamaydi. Vercel CLI ishlaydi (akkaunt `shavkatovpm-3711`):

```bash
npx vercel ls                      # eng yangi Production qatori "● Ready" bo'lishi kerak (odatda 20–40 soniya)
npx vercel inspect <deployment-url>
npx vercel env ls                  # faqat nomlar
```

Jonli tekshiruv (`curl`):

```bash
for p in /uz /ru /en /uz/results /uz/contact /uz/teachers /uz/admissions /robots.txt /sitemap.xml /llms.txt; do
  printf "%-20s " "$p"; curl -s -o /dev/null -w "%{http_code}\n" -L "https://www.ixlosschool.uz$p"
done
curl -sI https://www.ixlosschool.uz/uz | grep -i -E "x-frame|x-content-type|referrer-policy|permissions-policy"
```

Kutilgan: yuqoridagilar 200; `/uz/privacy` **404** (maxfiylik sahifasi egasi qaroriga ko'ra olib tashlangan); `sitemap.xml`da 15 ta URL; sarlavhalar `next.config.ts` dagidek. `<title>`, JSON-LD (School, Course, VideoObject, FAQPage) va meta teglarni sahifa manbasidan ko'rib tekshirish mumkin.

**Rollback:** Vercel dashboard, Deployments, oldingi "Ready" deployment, "Promote to Production" (yoki `npx vercel rollback <url>`). Yoki `git revert <sha>` va push.

## Environment variables

`.env.example`da namunalar bor. **Holat (2026-09-24):** Vercel Production'da `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` o'rnatilgan (qiymatlari ko'rinmaydi) va jonli formadan sinov arizasi muvaffaqiyatli yuborilgan; GA, Yandex Metrica va verification env'lari hali yo'q. Ariza boti: **@ixlosformbot** ("Ixlos Form"), arizalar "Leads IXLOS website" guruhiga keladi (oddiy guruh; supergroup'ga aylansa chat ID o'zgaradi va Vercel'dagi qiymatni yangilash kerak). Token faqat Vercel'da turadi: hech qachon repozitoriyga, hujjatga yoki chatga yozilmaydi.

| Nomi | Vazifa | Holat |
|---|---|---|
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Ariza formasi (`/api/apply`) Telegram'ga yuboradi | **Majburiy.** Ularsiz production'da 503 qaytadi va arizalar yo'qoladi. Chat ID topish: botga /start yozing yoki uni guruhga qo'shib xabar yuboring, so'ng `https://api.telegram.org/bot<TOKEN>/getUpdates` dan `chat.id` ni oling (guruh ID'si manfiy bo'ladi) |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID` | Google Analytics / Yandex Metrica | Ixtiyoriy (bo'sh bo'lsa skript yuklanmaydi) |
| `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION` | Search Console / Yandex Webmaster tasdiqlash meta tegi | Ixtiyoriy |

- Qo'shish: Vercel, Project, Settings, Environment Variables yoki `npx vercel env add NAME production`. Yangi env faqat **keyingi deploydan** kuchga kiradi: qiymat qo'shgach `main`ga bo'sh commit (`git commit --allow-empty`) push qiling. `vercel redeploy` 2026-09-24 da Turbopack shrift xatosi bilan yiqildi, shuning uchun ishlatilmasin.
- `NEXT_PUBLIC_*` va verification qiymatlari **build/render vaqtida** kiradi: o'zgartirgandan keyin qayta deploy kerak.

## Ma'lum muammolar

- Turbopack image cache: `/_next/image` eski rasmni beraversa `rm -rf .next` va dev serverni qayta ishga tushiring.
- `next.config.ts` o'zgarsa dev server o'zi qayta ishga tushadi (bir necha soniya).
- `/api/apply` ichidagi so'rovlar limiti (10 daqiqada 5 ta) xotirada (`Map`), IP `x-forwarded-for`ning birinchi qiymatidan olinadi.
- macOS'da `timeout` buyrug'i yo'q.

## Vercel'ga xos narsalar (droplet'ga ko'chganda almashtiriladi)

- `main`ga push'da avtomatik deploy (GitHub integratsiyasi).
- Vercel domen/SSL boshqaruvi va apex-to-`www` yo'naltirish.
- Vercel `Strict-Transport-Security` sarlavhasini o'zi qo'shadi; droplet'da buni web-server sozlashi kerak.
- Rasm optimizatsiyasi va CDN keshi.
- Environment variables Vercel paneli orqali.
- `.vercel/` papkasi (lokal ulanish).

## Droplet'ga ko'chish uchun eslatmalar (rejalashtirilgan, hali qilinmagan)

- **Build/run:** serverda `npm ci`, `npm run build`, `npm start`. Rasm optimizatsiyasi uchun `sharp` kerak: u `next`ning o'z `optionalDependencies`ida bor va `npm ci` bilan o'rnatiladi (linux uchun binar avtomatik tanlanadi; o'rnatilganini `npm ls sharp` bilan tekshiring). Jarayonni `systemd` yoki PM2 boshqarsin. Ixtiyoriy: `output: "standalone"`.
- **Reverse proxy:** nginx yoki Caddy → `localhost:3000`. SSL (Let's Encrypt), HSTS, gzip/brotli. **`X-Forwarded-For`ni uzating**, aks holda ariza limiti hamma foydalanuvchini bitta IP deb hisoblaydi.
- **Host qoidalari:** `www.ixlosschool.uz` asosiy, apex `ixlosschool.uz` → `www`ga 301/308. `SITE_URL`, sitemap, canonical, hreflang va `llms.txt` shu hostda yozilgan: host o'zgarmasa, ularga tegish shart emas.
- **Admin panel (rejalashtirilgan):** keyinroq admin panel qo'shiladi va u ham droplet'da ishlaydi. Shuning uchun ko'chishda ma'lumotlar bazasi, autentifikatsiya, doimiy saqlash (fayl/rasm) va zaxira nusxa (backup) ham rejalashtirilsin; ariza formasi hozir faqat Telegram'ga yuboradi va hech narsa saqlamaydi.
- **Env:** serverda `.env.production` (commit qilinmaydi) yoki systemd `EnvironmentFile`; yuqoridagi jadvaldagi nomlar.
- **Rasm keshi:** `.next/cache/images` deploylar orasida saqlansin (aks holda har deployda qayta kodlanadi). AVIF (`next.config.ts`da yoqilgan) protsessorni ko'p yeydi; kichik droplet'da sekin bo'lsa faqat `image/webp`ga qaytaring.
- **CI/CD:** Vercel integratsiyasi o'rniga GitHub Actions (SSH bilan `git pull`, build, `reload`) yoki serverdagi deploy skripti. Ikki marta deploy bo'lmasligi uchun ko'chirgach Vercel'dagi GitHub integratsiyasini o'chiring. Rollback uchun `releases/` papkalari va `current` symlink tavsiya etiladi.
- **DNS:** ko'chishdan oldin TTL'ni pasaytiring, droplet'da to'liq tekshirib bo'lgach A yozuvini almashtiring.
- **O'zgarishsiz qoladi:** `next.config.ts` dagi sarlavhalar (`next start` ostida ham ishlaydi), `src/proxy.ts` (Node), "Qoidalar" va "Deploydan oldin tekshiruv" bo'limlari.
- Ko'chgandan keyin: bu faylni yangilang va "Vercel'ga xos narsalar" bo'limini olib tashlang.

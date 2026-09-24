# Ixlos School — deploy workflow

> **Holat (2026-09-24): production DigitalOcean droplet'da.** `www.ixlosschool.uz` droplet'dagi Caddy orqali xizmat qilinadi. Vercel loyihasi ulangan holda qoldi va **zaxira** vazifasini bajaradi (DNS'ni qaytarsangiz sayt Vercel'dan chiqadi). Shu faylni ishonchli manba deb hisoblang va o'zgarish qilsangiz yangilang. Oxirgi yangilanish: 2026-09-24.

## Qisqacha

- **Kod:** GitHub `shavkatovpm/ixlosschool` (ochiq repozitoriy), branch `main`.
- **Hosting:** DigitalOcean droplet (Ubuntu 24.04, 1 vCPU, 1 GB RAM + 2 GB swap). **Server ABCO loyihasi bilan bo'lishilgan** (pastdagi "Server va ABCO'dan ajratish" bo'limi).
- **Deploy = commit + push + `scripts/deploy-droplet.sh`.** Skript faqat commit qilingan kodni (HEAD) shu kompyuterda quradi, tayyor papkani serverga yuboradi va oddiy Node konteynerida ishga tushiradi. Serverda hech narsa build qilinmaydi.
- **Domen:** `https://www.ixlosschool.uz` asosiy host (`SITE_URL`, `src/lib/seo.ts`). `ixlosschool.uz` → `www` ga 308. HTTP → HTTPS avtomatik. DNS Vercel nameserver'larida (`ns1/ns2.vercel-dns.com`), yozuvlar Vercel DNS'da.
- **Stack:** Next.js 16 (Turbopack), React 19, Tailwind v4, next-intl (UZ default / RU / EN), `output: "standalone"` (faqat `STANDALONE=1` bilan; Vercel build'lari o'zgarmagan).

## Qoidalar (kim va qachon deploy qiladi)

1. **Faqat egasi aniq "deploy" desa** push va serverga joylash qilinadi. Codex bilan UI ishlari parallel ketishi mumkin: yarim tayyor ish chiqib ketmasin.
2. `main`ga to'g'ridan-to'g'ri push (PR yo'q). Force-push yo'q, hook'lar o'tkazib yuborilmaydi (`--no-verify` yo'q).
3. **Repozitoriy ochiq (public).** Xom manba papkalari `.gitignore`da: `/teachers/`, `/info/`, `/23.09/`, `/1 kun/`, `/Owner/`, `/tasdiqnoma/`. `.env*` (faqat `.env.example`dan tashqari), token, parol va **server IP'si** hech qachon repozitoriyga yozilmaydi.
4. Codex va Claude bitta ishchi papkada ishlaydi: fayl tahrirlashdan oldin uni qayta o'qing, o'zgarishlarni kichik va aniq qiling.
5. **Server ABCO loyihasiga tegmaslik** (pastga qarang). Serverda faqat `/opt/edge` va `/opt/ixlosschool` ichida ishlang.

## Deploydan oldin tekshiruv (hammasi o'tishi shart)

```bash
npx tsc --noEmit
npx eslint .
```

Production build alohida nusxada (bir papkada `next build` ishlayotgan `next dev`ning `.next` papkasini buzadi). `scripts/deploy-droplet.sh` o'zi ham `git archive HEAD` nusxasida quradi va build yiqilsa to'xtaydi, shuning uchun alohida build tekshiruvi ixtiyoriy; baribir kerak bo'lsa:

```bash
COPY=$(mktemp -d)
rsync -a --exclude /node_modules --exclude /.next --exclude /.git --exclude /.vercel \
  --exclude /Owner --exclude /teachers --exclude /info --exclude /23.09 --exclude "/1 kun" --exclude /tasdiqnoma --exclude /.claude \
  ./ "$COPY/"
cp -Rc node_modules "$COPY/node_modules"   # macOS/APFS. Linux: cp -R --reflink=auto
cd "$COPY" && npx next build; echo "exit: $?"
```

- `--exclude` **boshida `/` bilan** yozilishi shart (aks holda `src/app/[locale]/teachers` va `public/teachers` ham tushib qoladi).
- Kutilgan natija: `exit: 0`, 27 ta statik sahifa (`/uz|ru|en` + `admissions`, `contact`, `results`, `teachers` har biri uchun, + `_not-found` va boshqalar). Sahifa qo'shilsa/olinsa bu son o'zgaradi.
- `next/font/google` build paytida internetdan yuklaydi: tarmoq kerak.
- Route o'chirilsa/nomi o'zgarsa `.next/types` eskirib `tsc` yiqiladi: `npx next typegen` va eski `.next/types/app/[locale]/<yo'l>` papkasini o'chiring. `next.config.ts` o'zgarganda dev server qayta ishga tushadi va bir necha soniya `tsc` xato berishi mumkin.
- Yangi matn `messages/uz.json`, `ru.json`, `en.json` uchalasida ham bo'lishi kerak. Sahifa title ≤ 60, description ≤ 160 belgi.
- Sir-tekshiruv: `git diff --cached | grep -n -i -E "[0-9]{8,}:AA[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (RSA|PRIVATE)|password\s*[:=]"`

## Commit va push

```bash
git add <aniq yo'llar>          # `git add -A` emas; keyin `git status --short` bilan tekshiring
git commit -F - <<'EOF'
Add <nima qilindi> (inglizcha, buyruq shaklida, ~70 belgigacha)

- qisqa punktlar: nima va nega

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
git push origin main
```

Trailer faqat Claude ishtirok etgan commit'larda. Push Vercel'da ham build ishga tushiradi (zaxira nusxa yangilanib turadi), lekin trafik unga bormaydi.

## Droplet'ga joylash

```bash
DEPLOY_HOST=root@<droplet-ip> bash scripts/deploy-droplet.sh
```

Skript: (1) `git archive HEAD` → vaqtinchalik papka, (2) `npm ci`, (3) `STANDALONE=1 next build`, (4) standalone + static + public'ni yig'adi, (5) `sharp`ning macOS fayllarini Linux/x64 bilan almashtiradi, (6) `rsync` bilan `/opt/ixlosschool/releases/<vaqt>-<sha>/` ga yuboradi, (7) `current` symlink'ni almashtirib `ixlos-web` konteynerini qayta yaratadi, (8) sog'liq tekshiruvi o'tmasa **avtomatik oldingi versiyaga qaytaradi**, (9) oxirgi 3 ta release'ni saqlaydi. Uncommitted o'zgarishlar joylanmaydi.

Qo'lda qaytarish: serverda `cd /opt/ixlosschool && ln -sfn releases/<oldingi> current && docker compose up -d --force-recreate web`.

Tekshiruv (`curl`):

```bash
for p in /uz /ru /en /uz/results /uz/contact /uz/teachers /uz/admissions /robots.txt /sitemap.xml /llms.txt; do
  printf "%-20s " "$p"; curl -s -o /dev/null -w "%{http_code}\n" -L "https://www.ixlosschool.uz$p"
done
curl -sI https://www.ixlosschool.uz/uz | grep -i -E "^via|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy"
```

Kutilgan: hammasi 200 (`/uz/privacy` **404**: maxfiylik sahifasi egasi qaroriga ko'ra olib tashlangan), `via: 1.1 Caddy`, `sitemap.xml`da 15 URL.

## Server va ABCO'dan ajratish

Droplet nomi `ABCO`: u ABCO academy loyihasining Postgres bazasini (Docker, `/root/abco-db`) ham ishlatadi. Ikkala loyiha rahbariyatga tegishli, lekin **bir-biriga aralashmasligi shart**.

| | ABCO (tegilmaydi) | Ixlos School |
|---|---|---|
| Papka | `/root/abco-db` | `/opt/ixlosschool`, `/opt/edge` |
| Compose loyiha | `abco-db` | `ixlos` (sayt), `edge` (Caddy) |
| Konteynerlar | `abco-db-postgres-1`, `abco-db-pgbouncer-1` | `ixlos-web`, `edge-caddy` |
| Tarmoq / volume | `abco-db_default`, `abco-db_abco_postgres_data` | `edge` (umumiy proxy tarmog'i), `ixlos_ixlos_next_cache` |
| Portlar | 5432, 6432 (butun internetga ochiq: ABCO qarori) | 80, 443 (faqat Caddy) |
| Baza | Postgres | Ixlos ABCO Postgres'ini **ishlatmaydi** (admin panel SQLite bo'ladi, o'z volume'ida) |

- `ixlos-web` hech qanday port e'lon qilmaydi: Caddy unga `edge` tarmog'i orqali `ixlos-web:3000` deb ulanadi. `mem_limit: 450m`, Caddy `96m`: xotira yetmasa ABCO Postgres emas, Ixlos konteyneri chegaralanadi.
- `/opt/ixlosschool/.env` (chmod 600, faqat root): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Repozitoriyda emas.
- Serverda faqat `docker compose ...` ni `/opt/ixlosschool` yoki `/opt/edge` ichida ishlating. `docker system prune`, `docker volume prune`, `docker stop $(docker ps -q)` kabi umumiy buyruqlar **taqiqlangan** (ABCO'ga tegadi).
- Swap: 2 GB (`/swapfile`), `vm.swappiness=10`. Umumiy server uchun foydali.
- Bilinadigan xavflar (ABCO tomoni): baza **zaxira nusxasi yo'q**, Postgres porti ochiq, ~42 ta kutilayotgan yangilanish, `PermitRootLogin yes` (faqat kalit bilan). Bularga egasi aytmaguncha tegilmaydi.

## Caddy va HTTPS

- `/opt/edge/Caddyfile`: `www.ixlosschool.uz` → `ixlos-web:3000` (siqish zstd/gzip), `ixlosschool.uz` → `www` ga 308. Sertifikatlar Let's Encrypt'dan avtomatik olinadi va yangilanadi (volume `edge_caddy_data`).
- **HSTS hozircha qisqa** (`max-age=300`). Hammasi bir-ikki hafta barqaror ishlagach `31536000` ga ko'tariladi (Caddyfile'da `header Strict-Transport-Security`, so'ng `docker exec edge-caddy caddy reload --config /etc/caddy/Caddyfile`).
- Yangi sayt/loyiha qo'shish: alohida compose'da `edge` tarmog'iga ulanib, Caddyfile'ga yangi blok qo'shiladi. Eski HTTP-only variant: `/opt/edge/Caddyfile.http-phase`.
- Sertifikat olish uchun 80-port ochiq bo'lishi va domen serverga qarab turishi shart.

## DNS va Vercel'ga qaytish (rollback)

Vercel DNS'da (`npx vercel dns ls ixlosschool.uz`) qo'shilgan yozuvlar: apex `A → droplet` (`rec_a0cdae76e3540553f743ba67`) va `www A → droplet` (`rec_9fca3063bff4f768583fb1d6`). Ular Vercel'ning standart ALIAS yozuvlarini ustidan bosib turadi. **Vercel'ga qaytarish:** `npx vercel dns rm <record-id>` ikkalasiga; ~1 daqiqada sayt yana Vercel'dan chiqadi (Vercel loyihasi va uning env'lari saqlangan). Search Console tasdiqlash TXT yozuviga (`google-site-verification=...`) tegmang.

## Environment variables

`.env.example`da namunalar bor.

| Nomi | Vazifa | Joyi va holati |
|---|---|---|
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Ariza formasi (`/api/apply`) Telegram'ga yuboradi | Droplet `/opt/ixlosschool/.env` **va** Vercel Production'da o'rnatilgan. Bot: **@ixlosformbot**, guruh "Leads IXLOS website" (oddiy guruh; supergroup'ga aylansa chat ID o'zgaradi) |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID`, `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION` | Analitika va tasdiqlash kodlari | **Endi admin panelda** (Sozlamalar), deploy talab qilmaydi. Env faqat panel bo'lmagan joy (Vercel) uchun zaxira qiymat |
| `ADMIN_ENABLED`, `DATABASE_PATH` | Admin panelni yoqish va SQLite fayl yo'li (`/data/ixlos.db`) | Serverda yoqilgan (compose `environment`da) |
| `UPLOAD_DIR`, `BACKUP_DIR` | Panelda yuklangan rasmlar va baza nusxalari papkasi | Berilmasa `DATABASE_PATH` yonidagi `uploads/` va `backups/` (droplet'da `/data/uploads`, `/data/backups`, ya'ni `ixlos_data` volume'i ichida) |

- Serverdagi env o'zgarsa: `/opt/ixlosschool/.env` ni tahrirlab `docker compose up -d --force-recreate web`.
- Token hech qachon repozitoriyga, hujjatga yoki chatga yozilmaydi. `@BotFather`da `/revoke` qilib yangilash mumkin, so'ng Vercel va serverdagi qiymatni almashtiring.

## Ma'lum muammolar va eslatmalar

- `gh` (GitHub CLI) bu kompyuterda login qilinmagan; git ulanishi tokeni `workflow` ruxsatiga ega emas, shuning uchun `.github/workflows/` fayllarini push qilib bo'lmaydi. Kelajakdagi CI varianti tayyor: `Dockerfile`, `.dockerignore` va `docs/github-actions-docker.yml` (GHCR'ga image chiqaradi). Ishlatish uchun faylni GitHub veb-saytida `.github/workflows/docker.yml` sifatida qo'shing va paketni Public qiling; hozirgi jarayon unga bog'liq emas.
- Turbopack image cache: `/_next/image` eski rasmni beraversa `rm -rf .next` va dev serverni qayta ishga tushiring.
- `next.config.ts`da `standalone` (Docker/droplet) rejimida rasmlar faqat WebP va 30 kun keshlanadi (bitta kichik CPU uchun); Vercel build'i AVIF'ni saqlaydi.
- Bot skanerlari (`/info.php`, `/*.json` va h.k.) yangi domenga tez keladi: `[locale]` layout'ida `dynamicParams = false`, catch-all sahifa `force-dynamic`, shuning uchun ular keshlanmaydi va oddiy 404 oladi. Release papkasi konteynerda **faqat o'qish uchun** ulangan.
- `/api/apply` limiti (10 daqiqada 5 ta) xotirada, IP `x-forwarded-for`ning birinchi qiymatidan (Caddy uni qo'shadi). Konteyner qayta ishga tushsa limit tozalanadi.
- macOS'da `timeout` buyrug'i yo'q.
- **Sahifalar endi har so'rovda render qilinadi** (`[locale]/layout.tsx`da `dynamic = "force-dynamic"`): kontent (aloqa ma'lumoti, FAQ, ustozlar, videolar, maqolalar) admin paneldan o'zgaradi va deploy talab qilmaydi. Panel yo'q joyda (Vercel) sahifalar kod ichidagi standart kontentni ko'rsatadi. Local o'lchov: bosh sahifa ~13 ms CPU/so'rov; droplet'da ham kunlik trafik uchun yetarli.
- `/media/*` (panelda yuklangan rasmlar) `ixlos_data` volume'idan beriladi; volume'ni o'chirmang. Rasmlar bazadagi nusxaga kirmaydi: server darajasidagi zaxira (DigitalOcean Backups) ularni ham saqlaydi.
- Deploy skripti release papkasiga `RELEASE` faylini yozadi (panel: Sozlamalar → Tizim → Versiya).

## Keyingi rejalar

- **Admin panel:** to'liq (`docs/admin.md`); kunlik `VACUUM INTO` nusxasi panel o'zi oladi. Server darajasidagi **DigitalOcean Backups** hali yoqilmagan (egasi qarori).
- ABCO bazasi uchun zaxira nusxa va port himoyasi: egasi qaroridan keyin.
- Trafik oshsa: droplet'ni 2 GB'ga oshirish yoki oldiga CDN (masalan Cloudflare) qo'yish.

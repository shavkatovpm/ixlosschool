# Ixlos School — tasdiqlangan ranglar

Asosiy yo‘nalish: to‘q o‘rmon yashili va sovuq oq. Bu ranglar barcha tillar va sahifalar uchun umumiy. Vaqtinchalik rang tanlagichlar olib tashlangan.

## Asosiy ranglar

| Vazifa | Token / Tailwind klassi | Rang |
| --- | --- | --- |
| Asosiy yashil, CTA, muhim panellar | `brand` | `#163E32` |
| Tugmaning hover holati | `brand-soft` | `#285345` |
| Rahbariyat, surat gradientlari | `brand-deep` | `#102D25` |
| Sahifa foni | `paper` | `#EFF4F7` |
| Oqartirilgan kartochka | `surface` | `#FFFFFF` |
| Ikkinchi darajali neytral panel | `neutral` | `#E7EEF2` |
| Asosiy matn | `ink` | `#162E25` |
| Ikkinchi darajali matn | `moss` | `#365343` |
| To‘q fondagi matn | `on-brand` | `#EFF4F7` |
| To‘q fondagi yordamchi matn | `on-brand-muted` | `#C8D8D1` |
| Kam miqdordagi malaka/tajriba aksenti | `gold` | `#DBC38C` |

Ranglarning asosiy manbasi: `src/app/globals.css` ichidagi `@theme` bloki. CSS modullarida `var(--color-brand)` kabi o‘zgaruvchilar ishlatiladi. `khaki`, `tint-b` kabi eski token nomlari mavjud komponentlar bilan moslik uchun saqlangan; ularning qiymatlari tasdiqlangan sovuq oq palitraga mos. `lime`, `sage` va yashil `tint-*` qiymatlari tanlangan yashil variantning yordamchi tuslaridir.

## Qo‘llash qoidalari

- Sahifaning katta bo‘sh maydonlari — sovuq oq. Asosiy tugmalar va muhim panellar — to‘q yashil.
- To‘q yashil ustida `on-brand` yoki `on-brand-muted` ishlatilsin. Oqartirilgan fonda `ink` yoki `moss` ishlatilsin.
- Oltin rang faqat tajriba, malaka va kichik urg‘ular uchun. Oqartirilgan fonda mayda oltin matn ishlatilmasin.
- Bir xil amal tugmalari barcha sahifalarda bir xil rangda bo‘lsin. Qora yoki jigarrang alohida CTA kiritilmasin.
- Yangi komponentlar ichida tasodifiy HEX ranglar qo‘shilmasin; mavjud tokenlardan foydalanilsin.
- Xato holatlari uchun `danger-soft` saqlanadi. Bayroqlar, suratlar va sertifikatlarning haqiqiy ranglari brend rangiga o‘zgartirilmaydi.
- Tipografiya: Manrope — sarlavhalar, Geist — matnlar, Bodoni Moda — logotip yozuvi.

## Qamrov

Bosh sahifa, ustozlar, natijalar, qabul, 404 hamda umumiy header/footer bir xil global ranglarni oladi. `/logo` galereyasining interfeysi ham shu ranglarga mos. Galereyadagi original PNG va alohida nomlangan logotip variantlari manba/eksport materiallari sifatida saqlangan.

Saytda ishlatiladigan yashil SVG logotiplar, animatsion SVG nusxalar, favicon, Apple icon va PWA ikonkalari tasdiqlangan yashilga moslashtirilgan. Logotip yaratuvchi skriptlarda ham yangi yashil qiymat qo‘llanadi. Asl fotosuratlar va oldindan tayyorlangan raster reklama materiallari qayta bo‘yalmaydi.

Brauzer/PWA ranglari: `src/app/[locale]/layout.tsx` va `src/app/manifest.ts`. Rang keyinchalik o‘zgarsa, ushbu metama’lumotlar va statik logotip/ikonka eksportlari ham moslashtirilsin.

## Kontrast

To‘q panellarda `.brand-feature` matn rangini ham belgilaydi: faqat fonni to‘qlashtirish yetarli emas. Bu klass sarlavhalar uchun och matn, yordamchi yozuvlar uchun och ikkilamchi rang va fokus konturini beradi. Matnning rangini ota elementdan olishiga tayanilganda shu qoida saqlansin. Och yashil kartochkalardagi kichik izohlar uchun `text-ink/80`, to‘q fonda esa `text-on-brand-muted` ishlatilsin. Surat ustidagi matn tagida yetarlicha to‘q, yarim shaffof qatlam bo‘lsin.

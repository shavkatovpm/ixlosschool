# Ixlos /testgpt — raqobatchilar tahlili va dizayn qarorlari

2026-09-15. Maqsad: beshta tanlanadigan, mustaqil vizual yo‘nalish. Raqobatchi maktablarning natijalari va va’dalari Ixlos’ga ko‘chirilmagan. Ixlos mazmuni loyihadagi mavjud sahifa va `info/chatdan-kelgan-matnli-malumotlar.md` asosida yozilgan.

## Ko‘rilgan manbalar

| Maktab | Manba va tekshirish holati | Ixlos uchun dizayn xulosasi |
| --- | --- | --- |
| Registon | https://rgnschool.uz/ — sahifa mazmuni va Chrome’da bosh ekran ko‘rildi. Oq-ko‘k palitra, katta video va yonidagi ikkita axborot kartasi. | Birinchi ekranda kuchli vizual markaz; akademik bosqichlarni aniq ajratish. |
| Al Jabr | https://www.goldenpages.uz/uz/company/?Id=107243 va https://t.me/s/aljabrmaktabi — ochiq manbalar. Bir nechta o‘xshash nomli maktab bor. `al-jabr.uz` ochilmadi; aynan qaysi filial nazarda tutilgani tasdiqlanmadi. | Rasmiy sayt vizual auditi deb hisoblanmaydi. Ixtisoslashuvni oson tushuntirish yo‘nalishi o‘rganildi. |
| Rahimov | https://rakhimovschool.uz/ — bosh sahifa mazmuni ochildi; natijalar, ta’lim va ota-ona ishonchi yetakchi. | Ota-onaga tushunarli manfaat, dalilga tayangan matn va aniq qabul yo‘li. |
| Jahon | https://jahonschool.uz/ — mazmun va Chrome’dagi bosh ekran ko‘rildi. Yashil palitra, asoschi portreti, hajmli ikonalar, katta sarlavha. | Kuchli brend belgisi, ta’limni ota-onaning savollari bilan bog‘lash, alohida kompozitsiya. |
| Sharjah | https://my-school.uz/schools/sharjah-school — katalog profili; unda rasmiy Instagram/Telegram manbalari keltirilgan. Ijtimoiy sahifalar ochilmadi, alohida sayt topilmadi. | Qadriyat va kundalik parvarish mavzusi. Rasmiy sayt dizayni ko‘rildi degan da’vo yo‘q. |
| Iftihor | https://my-school.uz/schools/iftihor-school — profil ko‘rildi, undagi https://iftixorschool.uz manzili vaqt tugashi bilan ochilmadi. | Individual yondashuv, ota-ona bilan aloqa, xavfsizlikni sodda tushuntirish. Vizual audit cheklangan. |
| Yuksalish | https://yuksalish-maktablari.uz/uz — sahifa mazmuni ochildi. Tarmoq, filiallar, imkoniyatlar va qabul. | Ma’lumotlarni bo‘limlarga tartibli ajratish, topilishi oson navigatsiya. |
| Target | https://www.targetschool.uz/ — domen ochildi, o‘qiladigan mazmun qaytmadi. https://uz.linkedin.com/company/target-international-school profilida sayt va biznes/IT ixtisoslashuvi tasdiqlandi. | Texnologik va kasbga yo‘naltirilgan pozitsiya; sayt vizual auditi cheklangan. |
| Sodiq | https://sodiqschool.uz/uz — sahifa mazmuni ochildi. Natija, ota-onalar fikri, missiya va qabul. | Bir ma’noli asosiy xabar va qabul tugmasi. Ixlos uchun begona natijalar ishlatilmagan. |
| Vosiq | https://vosiq.uz/en — sahifa mazmuni ochildi; ta’lim, maktab hayoti, qabul, bolani rivojlantirish. https://ibo.org/programmes/find-an-ib-school/ibaem2/v/vosiq-international-school/ rasmiy domenni tasdiqlaydi. | Bolaning imkoniyatlari, qiziqish va rivojlanish mavzusi; dasturlar ierarxiyasi. |

Bu xulosalar manbalardan kelib chiqqan dizaynerlik talqini. Barcha o‘nta maktabning jonli vizual auditi bajarilgani da’vo qilinmaydi.

## Beshta yangi yo‘nalish

1. **Meros** — bordo va iliq oq; klassik serif, chapdagi katta tipografiya, o‘ngda me’moriy kitob kompozitsiyasi, muhr, tahririy bo‘limlar.
2. **Kelajak** — to‘q ko‘k va muzrang; markaziy sarlavha, planetariy sahnasi va yon axborotlar, texnologik kartalar.
3. **Kashfiyot** — sariq, binafsha va yalpiz; bento bosh ekran, yumaloq shakllar, rangli ta’lim bosqichlari va to‘garaklar.
4. **Zamin** — yashil va tabiiy oq; chapda organik kesimli kitob-daraxt, o‘ngda serif matn, ochiq ustunlar va gorizontal dastur ro‘yxati.
5. **Parvoz** — ultramarin, qora va laym; plakat tipografiyasi, asimmetrik qora matn/ko‘k samolyot bloki, qat’iy chiziqli kartalar.

## Ishlaydigan elementlar

- Besh toggle; tanlov `?design=meros|kelajak|kashfiyot|zamin|parvoz` bilan ulashiladi.
- Klaviaturada chap/o‘ng, Home/End; brauzer Back/Forward bilan tanlov sinxronlanadi.
- Mobil menyu, sahifa ichidagi navigatsiya, to‘garak filtrlari, FAQ ochish/yopish.
- Qabul CTA mavjud `/uz#apply` formasiga olib boradi.
- 5 ta yangi, loyihaga saqlangan WebP 3D tasvir (har biri taxminan 84–212 KB).
- 700/900/1150px moslashuvlar; reduced-motion, focus va skip link.

Promptlar va tasvirlar: [testgpt-v2-assets.md](./testgpt-v2-assets.md).

import type { Contact, Legal } from "./center";

export type LlmsArticle = { slug: string; title: Record<"uz" | "ru" | "en", string>; description: Record<"uz" | "ru" | "en", string> };

// llms.txt for AI assistants. Contact and legal facts come from the editable centre details; the rest is fixed text
// that restates what the school itself publishes. Articles are appended by the route.
export function llmsTemplate(c: Contact, l: Legal, articles: LlmsArticle[] = []): string {
  const blog = articles.length
    ? `\n\n## Blog (articles for parents)\n\n${articles
        .map((a) => `- [${a.title.en}](https://www.ixlosschool.uz/en/blog/${a.slug}): ${a.description.en} (Uzbek: https://www.ixlosschool.uz/uz/blog/${a.slug}; Russian: https://www.ixlosschool.uz/ru/blog/${a.slug})`)
        .join("\n")}`
    : "";
  return `# Ixlos School

> Ixlos School is a private school in the Yunusabad district of Tashkent, Uzbekistan, for grades 1–11, specializing in finance and IT. Grades 5–9 study mathematics, English and informatics in depth; grades 10–11 follow an Accounting or IT track. The school guarantees graduates an IELTS score of at least 5.5 and awards a professional diploma (Accounting or IT). The website is available in Uzbek (default), Russian and English.

Facts on this page come from the school's own materials.

## Contact

- Address: ${c.addressParts.streetAddress}, ${c.addressParts.addressRegion}, ${c.addressParts.addressLocality}, Uzbekistan
- Phone: ${c.phonesDisplay.join(", ")}
- Hours: ${c.hours}
- Telegram: ${c.telegramUrl}
- Instagram: ${c.instagramUrl}
- YouTube: ${c.youtubeUrl}
- Legal entity: ${l.legalName} (non-state educational institution, NTM), TIN (STIR) ${l.taxIdDisplay}.
- Licence: No. ${l.licenseNumber}, valid from ${l.licenseDateDisplay} (unlimited), issued by the Ministry of Preschool and School Education of the Republic of Uzbekistan; activity: general secondary education services, grades 1–11.
- Documents (scans, also shown in the site footer): [State registration certificate (PDF)](https://www.ixlosschool.uz/legal/guvohnoma-ixlos-school.pdf), [Educational activity licence (PDF)](https://www.ixlosschool.uz/legal/litsenziya-1697880.pdf)

## Pages

- [Home (Uzbek)](https://www.ixlosschool.uz/uz): overview, programme, daily life, results, video testimonials, clubs, FAQ, application form
- [Home (Russian)](https://www.ixlosschool.uz/ru): the same in Russian
- [Home (English)](https://www.ixlosschool.uz/en): the same in English
- [Admissions (Uzbek)](https://www.ixlosschool.uz/uz/admissions): how admission works
- [Admissions (Russian)](https://www.ixlosschool.uz/ru/admissions): порядок приёма
- [Admissions (English)](https://www.ixlosschool.uz/en/admissions): how admission works
- [Teachers (Uzbek)](https://www.ixlosschool.uz/uz/teachers): education, qualifications and experience of the school's teachers
- [Teachers (Russian)](https://www.ixlosschool.uz/ru/teachers): преподаватели школы
- [Teachers (English)](https://www.ixlosschool.uz/en/teachers): the same in English
- [Results (Uzbek)](https://www.ixlosschool.uz/uz/results): students' IELTS, SAT and online mathematics olympiad results, plus video stories (in Uzbek) from parents and students
- [Results (Russian)](https://www.ixlosschool.uz/ru/results): результаты учеников
- [Results (English)](https://www.ixlosschool.uz/en/results): the same in English
- [Contact and address (Uzbek)](https://www.ixlosschool.uz/uz/contact): address, phones, hours and a fact sheet about the school
- [Contact and address (Russian)](https://www.ixlosschool.uz/ru/contact): контакты, адрес и краткие сведения о школе
- [Contact and address (English)](https://www.ixlosschool.uz/en/contact): the same in English

## Key facts (English)

- Grades: 1–11. Admission is based on a test in mathematics and English plus an interview with the school psychologist; the pass mark is at least 60 points.
- Grades 1–4: fundamental education in Russian and Uzbek groups.
- Grades 5–9: in-depth Mathematics, English and Informatics.
- Grades 10–11: Accounting or IT track with a professional diploma; international ACCA and SAT programmes; IELTS 5.5+ guaranteed to graduates.
- Groups A / B / C by knowledge level, re-formed based on weekly exams. Extra Saturday classes for students who are falling behind (Mathematics and English in upper grades, core subjects in primary grades).
- Five-day school week, Monday to Friday, 08:30–17:30. Three meals a day. School bus for students who live far away. School uniform.
- Eight free clubs included in tuition: Mental Arithmetic, Chess, Arabic, Robotics, IT, Speech Therapy, Football, Judo.
- Payment: annual or monthly. Students with high quarterly results study on a monthly scholarship.
- Location: ${c.address}. Phone ${c.phonesDisplay[0]}.
- Full-day school: classes 08:30–17:30 Monday to Friday, three meals a day, free clubs after lessons, school bus for students who live far away.
- Grade 1 admission: like every grade, by a test in mathematics and English plus an interview with the school psychologist (pass mark at least 60).
- Language: grades 1–4 have Uzbek- and Russian-medium groups. The school does not state the language of instruction for grades 5–11.
- IT and programming: informatics is taught in depth in grades 5–9; grades 10–11 have an IT track with a professional diploma; a free IT and coding club runs after lessons.
- Finance and accounting: grades 10–11 have an Accounting track with a professional diploma and the international ACCA programme; the founder holds the ACCA Diploma in International Financial Reporting and F1–F9 qualifications.
- Tuition: depends on the grade level; paid annually or monthly, with a scholarship for students with high quarterly results. Current prices are given by the admissions office (${c.phonesDisplay[0]}); they are not published on the site.
- Students' results page shows named IELTS and SAT scores and certificates of participation in an online mathematics olympiad.
- Video testimonials (Uzbek, on the school's YouTube channel): parents' opinions, English results, an Xpert competition winner who earned a trip to America, a 9th grader with IELTS 8.0, and a student who won grants from several universities.

## Asosiy ma'lumotlar (O'zbekcha)

- Ixlos School — Toshkent, Yunusobod tumanidagi 1–11-sinf uchun xususiy maktab, Moliya va IT yo'nalishiga ixtisoslashgan; 5–9-sinflarda matematika, ingliz tili va informatika chuqurlashtirilgan.
- Qabul matematika va ingliz tilidan test hamda psixolog bilan suhbat orqali; o'tish bali — kamida 60.
- Bitiruvchilarga IELTS 5.5+ kafolatlanadi, Buxgalteriya yoki IT bo'yicha kasbiy diplom beriladi.
- A/B/C guruhlar har haftalik imtihon natijasiga ko'ra yangilanadi; shanba kunlari qo'shimcha darslar bor.
- Dushanbadan jumagacha 08:30–17:30, kuniga 3 mahal ovqat, maktab avtobusi, 8 ta bepul to'garak.
- Manzil: ${c.address}. Tel: ${c.phonesDisplay[0]}.

## Основные факты (по-русски)

- Ixlos School — частная школа в Юнусабадском районе Ташкента для 1–11 классов, специализирующаяся на финансах и IT; в 5–9 классах углублённо изучаются математика, английский язык и информатика.
- Приём по результатам теста по математике и английскому языку и собеседования с психологом; проходной балл — не менее 60.
- Выпускникам гарантирован IELTS не ниже 5.5 и профессиональный диплом (Бухгалтерия или IT).
- Группы A/B/C обновляются по итогам еженедельных экзаменов; по субботам проходят дополнительные занятия.
- С понедельника по пятницу 08:30–17:30, трёхразовое питание, школьный автобус, 8 бесплатных кружков.
- Адрес: ${c.address}. Тел: ${c.phonesDisplay[0]}.
${blog}
`;
}

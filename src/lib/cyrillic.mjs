// Uzbek in Cyrillic script, made from the Latin text. The /uz-cyrl pages have no texts of their own: messages, FAQ,
// teachers and articles are written once, in Latin, and shown through toCyrillic(). Plain .mjs so that
// scripts/generate-og-images.mjs can use it too.
//
// Spelling is rule-based, so new content may bring words the rules get wrong. Two groups of lists fix that:
//   KEEP, KEEP_UPPER, FOREIGN   names and terms that stay in Latin (Ixlos School, IELTS, Cambridge…)
//   EXACT, WORDS, STEMS         words whose Cyrillic spelling cannot be derived (oktabr -> октябрь)

const APOSTROPHES = /[’‘ʻʼ`]/g;

// Stay in Latin whatever their case.
const KEEP = new Set([
  "ixlos", "school", "university", "oriental", "profi", "xpert", "robouz", "full", "paper", "english",
  "google", "maps", "telegram", "instagram", "facebook", "tiktok", "whatsapp", "zoom", "chrome", "android",
  "python", "javascript", "scratch", "excel", "powerpoint", "roblox", "minecraft", "chatgpt", "duolingo",
  "cambridge", "oxford", "harvard", "ielts", "toefl", "cefr", "acca", "dipifr", "ifrs", "igcse", "gmat", "abco",
  "umft", "aifu", "isft", "wiut", "html", "css", "pdf", "stem", "steam", "mba", "gpa", "unicef", "unesco",
]);

// Stay in Latin only in capitals: in lower case these are (or could be) Uzbek words.
const KEEP_UPPER = new Set(["IT", "SAT", "AI", "AP", "IB", "JS", "GRE", "MIT", "CFA", "CIMA", "CIPA", "IOS", "JAVA", "WORD"]);

// Letter groups Uzbek does not have: the word is foreign and is left as it is.
const FOREIGN = /w|c(?!h)|ee|oo|ph/i;

const EXACT = { "O'zMU": "ЎзМУ" };

// Whole words (any case). The months lose their "ь" before a suffix, so only the bare form is listed here.
const WORDS = {
  sentabr: "сентябрь", oktabr: "октябрь", noyabr: "ноябрь", dekabr: "декабрь", yanvar: "январь", fevral: "февраль",
  aprel: "апрель", iyun: "июнь", iyul: "июль", medal: "медаль", football: "футбол", yandex: "яндекс",
  rayon: "район", mayor: "майор", yogurt: "йогурт", yoga: "йога",
};

// Word beginnings; the rest of the word (its suffixes) follows the rules.
const STEMS = [
  ["sentabr", "сентябр"], ["oktabr", "октябр"], ["litsey", "лицей"], ["litsenz", "лиценз"], ["kompyuter", "компьютер"],
  ["fakultet", "факультет"], ["intervyu", "интервью"], ["konsert", "концерт"], ["protsent", "процент"],
  ["dotsent", "доцент"], ["stansiya", "станция"], ["konferensiya", "конференция"], ["kompetensiya", "компетенция"],
  ["festival", "фестиваль"], ["film", "фильм"], ["albom", "альбом"], ["obyekt", "объект"], ["subyekt", "субъект"],
];

const LETTERS = {
  a: "а", b: "б", d: "д", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п",
  q: "қ", r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з",
};
const PAIRS = { "o'": "ў", "g'": "ғ", sh: "ш", ch: "ч", yo: "ё", yu: "ю", ya: "я", ye: "е" };

/** One lower-case Latin word (apostrophes already normalised) in Cyrillic. */
function spell(word) {
  if (WORDS[word]) return WORDS[word];
  const stem = STEMS.find(([latin]) => word.startsWith(latin));
  let out = stem ? stem[1] : "";
  let prev = stem ? "-" : "";
  for (let i = stem ? stem[0].length : 0; i < word.length; ) {
    const at = (s) => word.startsWith(s, i);
    const pair = word.slice(i, i + 2);
    let latin = word[i];
    let cyr;
    if (at("s'h")) [latin, cyr] = ["s'", "с"]; // Is'hoq: the apostrophe only keeps "s" and "h" apart
    else if (at("yo'")) cyr = "й"; // yo'l -> йўл, not ёъл
    else if (at("tsiya") || at("tsion")) [latin, cyr] = ["ts", "ц"];
    else if (at("ksiya") || at("psiya")) [latin, cyr] = [pair, `${LETTERS[word[i]]}ц`]; // aksiya -> акция
    else if (PAIRS[pair]) [latin, cyr] = [pair, PAIRS[pair]];
    else if (latin === "e") cyr = prev === "" || "aeiou".includes(prev) ? "э" : "е";
    else if (latin === "'") cyr = "ъ";
    else cyr = LETTERS[latin] ?? latin;
    out += cyr;
    prev = latin[latin.length - 1];
    i += latin.length;
  }
  return out;
}

function withCaseOf(source, out) {
  const letters = source.replace(/'/g, "");
  if (letters.length > 1 && letters === letters.toUpperCase()) return out.toUpperCase();
  if (letters[0] !== letters[0].toLowerCase()) return out[0].toUpperCase() + out.slice(1);
  return out;
}

const convert = (word) => withCaseOf(word, spell(word.toLowerCase()));

const isName = (word) => KEEP.has(word.toLowerCase()) || KEEP_UPPER.has(word) || FOREIGN.test(word) || /[a-z][A-Z]/.test(word);

function convertWord(original, before, after) {
  const word = original.replace(APOSTROPHES, "'");
  if (EXACT[word]) return EXACT[word];
  if (WORDS[word.toLowerCase()]) return convert(word);
  // IELTS'dan, School'ga: a Latin name with an Uzbek suffix.
  const cut = word.indexOf("'");
  if (cut > 1 && isName(word.slice(0, cut))) return original.slice(0, cut + 1) + convert(word.slice(cut + 1));
  // C1, F9, 3D: codes, not words. Group letters (A, B, C) and Roman numerals too; "U" is the only one-letter word.
  if (/\d/.test(before) || /\d/.test(after)) return original;
  if (isName(word) || (/^[A-Z]$/.test(word) && word !== "U") || /^[IVX]{2,}$/.test(word)) return original;
  return convert(word);
}

// Left untouched: links, e-mail addresses, @handles, {placeholders} of the message files, Markdown link targets and
// `code`, bare domain names.
const PROTECTED = /https?:\/\/\S+|www\.\S+|[\w.+-]+@[\w-]+\.[\w.-]+|@\w[\w.]*|\{[^{}]*\}|\]\([^)\s]*\)|`[^`]*`|\b[\w-]+\.(?:uz|com|org|net|ru|io|me)\b(?:\/\S*)?/g;
// A trailing apostrophe belongs to the word only after o or g (bog', to'g').
const WORD = /[A-Za-z]+(?:['’‘ʻʼ`][A-Za-z]+)*(?:(?<=[oOgG])['’‘ʻʼ`])?/g;

const convertWords = (text) =>
  text.replace(WORD, (word, index) => convertWord(word, text[index - 1] ?? "", text[index + word.length] ?? ""));

/**
 * Uzbek Latin text in Cyrillic script.
 * @param {string} text
 * @returns {string}
 */
export function toCyrillic(text) {
  let out = "";
  let last = 0;
  for (const match of text.matchAll(PROTECTED)) {
    out += convertWords(text.slice(last, match.index)) + match[0];
    last = match.index + match[0].length;
  }
  return out + convertWords(text.slice(last));
}

/**
 * A whole message tree (objects, arrays, strings) with every string in Cyrillic script.
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function toCyrillicDeep(value) {
  if (typeof value === "string") return /** @type {T} */ (toCyrillic(value));
  if (Array.isArray(value)) return /** @type {T} */ (value.map(toCyrillicDeep));
  if (value && typeof value === "object") {
    return /** @type {T} */ (Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toCyrillicDeep(item)])));
  }
  return value;
}

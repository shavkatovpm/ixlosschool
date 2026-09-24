// Creates the admin user, or resets its password (existing sessions are ended).
//
//   npm run admin:create                      locally (data/ixlos.db)
//   docker exec -it ixlos-web node tools/scripts/admin-create.mjs      on the droplet
//
// The password is typed hidden and never stored in plain text. For automated tests only, ADMIN_EMAIL and
// ADMIN_PASSWORD can be given as environment variables instead of prompts. ADMIN_MUST_CHANGE=1 makes the
// account change that (temporary) password on first sign-in.
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "../src/lib/admin/password.mjs";
import { migrate } from "../src/lib/admin/schema.mjs";

const MIN_PASSWORD = 12;

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Hide what is typed: only the prompt itself is echoed.
      rl._writeToOutput = (text) => {
        if (text.includes(question)) process.stdout.write(question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const fail = (message) => {
  console.error(`Xato: ${message}`);
  process.exit(1);
};

const email = (process.env.ADMIN_EMAIL || (await ask("Admin email: "))).trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("email noto'g'ri.");

let password = process.env.ADMIN_PASSWORD;
if (!password) {
  password = await ask(`Parol (kamida ${MIN_PASSWORD} belgi): `, { hidden: true });
  if (password !== (await ask("Parolni qayta kiriting: ", { hidden: true }))) fail("parollar mos kelmadi.");
}
if (password.length < MIN_PASSWORD) fail(`parol kamida ${MIN_PASSWORD} belgidan iborat bo'lishi kerak.`);
if (password.toLowerCase().includes(email.split("@")[0])) fail("parol email nomini o'z ichiga olmasligi kerak.");

const file = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "ixlos.db");
fs.mkdirSync(path.dirname(file), { recursive: true });
const db = new DatabaseSync(file);
migrate(db);

const hash = await hashPassword(password);
const mustChange = process.env.ADMIN_MUST_CHANGE === "1" ? 1 : 0;
const existing = db.prepare("SELECT id FROM admin_users WHERE email = ?").get(email);
if (existing) {
  db.prepare("UPDATE admin_users SET password_hash = ?, must_change_password = ? WHERE id = ?").run(hash, mustChange, existing.id);
  db.prepare("DELETE FROM admin_sessions WHERE user_id = ?").run(existing.id);
  console.log(`Parol yangilandi: ${email}`);
} else {
  db.prepare("INSERT INTO admin_users (email, password_hash, created_at, must_change_password) VALUES (?, ?, ?, ?)").run(email, hash, Date.now(), mustChange);
  console.log(`Admin yaratildi: ${email}`);
}
const others = Number(db.prepare("SELECT COUNT(*) AS c FROM admin_users WHERE email != ?").get(email).c);
if (others > 0) console.log(`Diqqat: bazada yana ${others} ta admin bor (rejada faqat bitta super-admin).`);
db.close();

import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./db";
import { hashPassword, verifyPassword } from "./password.mjs";

export const SESSION_COOKIE = "ixlos_admin";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_ACCOUNT = 5;
const MAX_FAILS_PER_IP = 20;
// Attempts against one account from many addresses are capped too (a slow, distributed guess).
const MAX_FAILS_PER_ACCOUNT_ANYWHERE = 50;

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

// A real hash to compare against when the e-mail is unknown, so response time does not reveal accounts.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword(randomBytes(16).toString("hex")));

async function clientIp() {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function failures(key: string, since: number) {
  return Number(getDb().prepare("SELECT COUNT(*) AS c FROM login_attempts WHERE key = ? AND at > ?").get(key, since)?.c ?? 0);
}

export type LoginResult = { ok: true } | { ok: false; error: "invalid" | "throttled" };

export async function login(email: string, password: string): Promise<LoginResult> {
  const db = getDb();
  const now = Date.now();
  const ip = await clientIp();
  const accountKey = `a:${email.toLowerCase()}|${ip}`;
  const anywhereKey = `g:${email.toLowerCase()}`;
  const ipKey = `i:${ip}`;

  db.prepare("DELETE FROM login_attempts WHERE at < ?").run(now - WINDOW_MS);
  db.prepare("DELETE FROM admin_sessions WHERE expires_at < ?").run(now);
  if (
    failures(accountKey, now - WINDOW_MS) >= MAX_FAILS_PER_ACCOUNT ||
    failures(anywhereKey, now - WINDOW_MS) >= MAX_FAILS_PER_ACCOUNT_ANYWHERE ||
    failures(ipKey, now - WINDOW_MS) >= MAX_FAILS_PER_IP
  ) {
    return { ok: false, error: "throttled" };
  }

  const user = db.prepare("SELECT id, password_hash FROM admin_users WHERE email = ?").get(email);
  const valid = await verifyPassword(password, user ? String(user.password_hash) : await getDummyHash());
  if (!user || !valid) {
    const record = db.prepare("INSERT INTO login_attempts (key, at) VALUES (?, ?)");
    record.run(accountKey, now);
    record.run(anywhereKey, now);
    record.run(ipKey, now);
    return { ok: false, error: "invalid" };
  }

  db.prepare("DELETE FROM login_attempts WHERE key = ?").run(accountKey);
  const token = randomBytes(32).toString("base64url");
  db.prepare("INSERT INTO admin_sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)").run(
    sha256(token),
    user.id,
    now,
    now + SESSION_MS,
  );
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_MS / 1000,
  });
  return { ok: true };
}

export type Session = { userId: number; email: string; mustChangePassword: boolean };

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      "SELECT u.id AS id, u.email AS email, u.must_change_password AS must_change, s.expires_at AS expires_at FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id WHERE s.token_hash = ?",
    )
    .get(sha256(token));
  if (!row || Number(row.expires_at) < Date.now()) return null;
  return { userId: Number(row.id), email: String(row.email), mustChangePassword: Number(row.must_change) === 1 };
}

export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(sha256(token));
  jar.delete({ name: SESSION_COOKIE, path: "/admin" });
}

export function hasAdminUser() {
  return Number(getDb().prepare("SELECT COUNT(*) AS c FROM admin_users").get()?.c ?? 0) > 0;
}

export type AccountChange = { ok: true } | { ok: false; error: "wrong_current" | "mismatch" | "short" | "weak" | "same" | "email_invalid" | "email_taken" };

export const MIN_PASSWORD_LENGTH = 12;

/** Changes the signed-in admin's password (and optionally e-mail); all other sessions are ended. */
export async function changeAccount(
  session: Session,
  input: { currentPassword: string; newPassword: string; confirmPassword: string; email: string },
): Promise<AccountChange> {
  const db = getDb();
  const user = db.prepare("SELECT password_hash FROM admin_users WHERE id = ?").get(session.userId);
  if (!user || !(await verifyPassword(input.currentPassword, String(user.password_hash)))) return { ok: false, error: "wrong_current" };

  const email = input.email.trim().toLowerCase() || session.email;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "email_invalid" };
  const taken = db.prepare("SELECT id FROM admin_users WHERE email = ? AND id != ?").get(email, session.userId);
  if (taken) return { ok: false, error: "email_taken" };

  if (input.newPassword !== input.confirmPassword) return { ok: false, error: "mismatch" };
  if (input.newPassword.length < MIN_PASSWORD_LENGTH) return { ok: false, error: "short" };
  if (input.newPassword === input.currentPassword) return { ok: false, error: "same" };
  if (input.newPassword.toLowerCase().includes(email.split("@")[0])) return { ok: false, error: "weak" };

  db.prepare("UPDATE admin_users SET email = ?, password_hash = ?, must_change_password = 0 WHERE id = ?").run(
    email,
    await hashPassword(input.newPassword),
    session.userId,
  );
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  db.prepare("DELETE FROM admin_sessions WHERE user_id = ? AND token_hash != ?").run(session.userId, token ? sha256(token) : "");
  return { ok: true };
}

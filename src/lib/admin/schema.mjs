// Database schema, shared by the app (db.ts) and scripts/admin-create.mjs.
// Migrations are append-only: never edit an existing entry, add a new one.
const MIGRATIONS = [
  `CREATE TABLE admin_users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT NOT NULL UNIQUE COLLATE NOCASE,
     password_hash TEXT NOT NULL,
     created_at INTEGER NOT NULL
   );
   CREATE TABLE admin_sessions (
     token_hash TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
     created_at INTEGER NOT NULL,
     expires_at INTEGER NOT NULL
   );
   CREATE TABLE login_attempts (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     key TEXT NOT NULL,
     at INTEGER NOT NULL
   );
   CREATE INDEX login_attempts_key_at ON login_attempts(key, at);`,
  `CREATE TABLE leads (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     name TEXT NOT NULL,
     phone TEXT NOT NULL,
     grade TEXT NOT NULL,
     locale TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'new',
     note TEXT NOT NULL DEFAULT ''
   );
   CREATE INDEX leads_status_created ON leads(status, created_at DESC);`,
  // Accounts created with a temporary password must change it on first sign-in.
  `ALTER TABLE admin_users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;`,
  // The panel manages the website, not the sales pipeline: applications are only archived (Telegram is
  // where the admissions team works), so the status/note columns are removed.
  `DROP INDEX leads_status_created;
   ALTER TABLE leads DROP COLUMN status;
   ALTER TABLE leads DROP COLUMN note;
   CREATE INDEX leads_created ON leads(created_at DESC);`,
  // First-party, cookieless traffic statistics. No IP address or user agent is stored: visitors are a
  // per-day salted hash, so nobody can be followed across days.
  `CREATE TABLE pageviews (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     at INTEGER NOT NULL,
     day TEXT NOT NULL,
     path TEXT NOT NULL,
     locale TEXT NOT NULL DEFAULT '',
     visitor TEXT NOT NULL DEFAULT '',
     source TEXT NOT NULL DEFAULT 'direct',
     medium TEXT NOT NULL DEFAULT 'direct',
     campaign TEXT NOT NULL DEFAULT '',
     device TEXT NOT NULL DEFAULT '',
     browser TEXT NOT NULL DEFAULT '',
     kind TEXT NOT NULL DEFAULT 'human',
     bot TEXT NOT NULL DEFAULT '',
     bot_kind TEXT NOT NULL DEFAULT ''
   );
   CREATE INDEX pageviews_kind_day ON pageviews(kind, day);
   CREATE INDEX pageviews_at ON pageviews(at);
   CREATE TABLE daily_salts (day TEXT PRIMARY KEY, salt TEXT NOT NULL);`,
  // Where an application came from (first-touch attribution sent by the site form).
  `ALTER TABLE leads ADD COLUMN source TEXT NOT NULL DEFAULT '';
   ALTER TABLE leads ADD COLUMN medium TEXT NOT NULL DEFAULT '';
   ALTER TABLE leads ADD COLUMN campaign TEXT NOT NULL DEFAULT '';
   ALTER TABLE leads ADD COLUMN landing TEXT NOT NULL DEFAULT '';
   ALTER TABLE leads ADD COLUMN device TEXT NOT NULL DEFAULT '';
   CREATE INDEX leads_source ON leads(source);`,
  // Site settings edited in the panel (centre details, integrations): JSON values by key.
  `CREATE TABLE settings (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL,
     updated_at INTEGER NOT NULL
   );`,
  // FAQ entries (every text in Uzbek, Russian and English).
  `CREATE TABLE faq (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     position INTEGER NOT NULL,
     published INTEGER NOT NULL DEFAULT 1,
     q_uz TEXT NOT NULL, a_uz TEXT NOT NULL,
     q_ru TEXT NOT NULL, a_ru TEXT NOT NULL,
     q_en TEXT NOT NULL, a_en TEXT NOT NULL,
     updated_at INTEGER NOT NULL
   );
   CREATE INDEX faq_position ON faq(position);`,
  // Video testimonials (YouTube Shorts / videos shown in the "Video fikrlar" wall).
  `CREATE TABLE testimonials (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     position INTEGER NOT NULL,
     published INTEGER NOT NULL DEFAULT 1,
     youtube_id TEXT NOT NULL UNIQUE,
     thumb TEXT NOT NULL,
     upload_date TEXT NOT NULL,
     chip_uz TEXT NOT NULL, title_uz TEXT NOT NULL, desc_uz TEXT NOT NULL,
     chip_ru TEXT NOT NULL, title_ru TEXT NOT NULL, desc_ru TEXT NOT NULL,
     chip_en TEXT NOT NULL, title_en TEXT NOT NULL, desc_en TEXT NOT NULL,
     updated_at INTEGER NOT NULL
   );
   CREATE INDEX testimonials_position ON testimonials(position);`,
  // Teachers. Language-dependent details (focus, education, credential labels) live in the JSON column.
  `CREATE TABLE teachers (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     position INTEGER NOT NULL,
     published INTEGER NOT NULL DEFAULT 1,
     slug TEXT NOT NULL UNIQUE,
     photo TEXT NOT NULL,
     name_latin TEXT NOT NULL,
     name_cyrillic TEXT NOT NULL,
     experience_years INTEGER,
     data TEXT NOT NULL,
     updated_at INTEGER NOT NULL
   );
   CREATE INDEX teachers_position ON teachers(position);`,
];

/** @param {{ exec(sql: string): void, prepare(sql: string): { get(): any, run(...p: any[]): any } }} db */
export function migrate(db) {
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec("CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL)");
  const current = Number(db.prepare("SELECT COALESCE(MAX(version), 0) AS v FROM schema_version").get()?.v ?? 0);
  for (let i = current; i < MIGRATIONS.length; i++) {
    db.exec("BEGIN");
    try {
      db.exec(MIGRATIONS[i]);
      db.prepare("INSERT INTO schema_version (version) VALUES (?)").run(i + 1);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}

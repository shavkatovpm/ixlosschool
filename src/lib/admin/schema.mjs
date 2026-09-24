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

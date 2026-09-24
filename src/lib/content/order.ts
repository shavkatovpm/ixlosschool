import { getDb } from "../admin/db";

type OrderedTable = "faq" | "testimonials" | "teachers";

/** Moves one row a step up or down; positions are renumbered 1..n so gaps and duplicates cannot break the order. */
export function moveRow(table: OrderedTable, id: number, direction: "up" | "down") {
  const db = getDb();
  const ids = db
    .prepare(`SELECT id FROM ${table} ORDER BY position, id`)
    .all()
    .map((r) => Number(r.id));
  const from = ids.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  const update = db.prepare(`UPDATE ${table} SET position = ? WHERE id = ?`);
  db.exec("BEGIN");
  try {
    ids.forEach((rowId, index) => update.run(index + 1, rowId));
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

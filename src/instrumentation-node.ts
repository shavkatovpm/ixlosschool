import { backupIfDue } from "./lib/admin/backup";

const run = () => {
  try {
    backupIfDue();
  } catch (error) {
    console.error("[backup] daily backup failed:", error);
  }
};

setTimeout(run, 60_000).unref(); // not during start-up
setInterval(run, 60 * 60 * 1000).unref();

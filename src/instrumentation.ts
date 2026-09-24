// Runs once when the server starts. On the droplet (admin panel enabled) it keeps a daily copy of the database.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.ADMIN_ENABLED === "1") {
    await import("./instrumentation-node");
  }
}

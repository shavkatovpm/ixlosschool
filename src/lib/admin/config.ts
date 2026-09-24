// The admin panel needs a writable database, so it only exists where ADMIN_ENABLED=1 (the droplet).
// Everywhere else (Vercel, plain local dev) /admin answers 404.
export const adminEnabled = () => process.env.ADMIN_ENABLED === "1";

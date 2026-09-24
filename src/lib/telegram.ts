// Sends a message to the admissions Telegram group (bot token and chat id come from the server environment).

export type TelegramResult = "sent" | "failed" | "not_configured";

export const telegramConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

export async function sendToTelegram(text: string): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return "not_configured";

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

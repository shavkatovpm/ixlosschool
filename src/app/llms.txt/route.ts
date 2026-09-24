import { getContact, getLegal } from "@/lib/center";
import { llmsTemplate } from "@/lib/llms";

export const dynamic = "force-dynamic";

export function GET() {
  const body = llmsTemplate(getContact(), getLegal());
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}

import { getContact, getLegal } from "@/lib/center";
import { listArticles } from "@/lib/content/articles";
import { adminEnabled } from "@/lib/admin/config";
import { llmsTemplate } from "@/lib/llms";

export const dynamic = "force-dynamic";

export function GET() {
  let articles: Parameters<typeof llmsTemplate>[2] = [];
  if (adminEnabled()) {
    try {
      articles = listArticles()
        .filter((a) => a.status === "published")
        .map((a) => ({ slug: a.slug, title: a.title, description: a.description }));
    } catch (error) {
      console.error("[llms] could not read articles:", error);
    }
  }
  return new Response(llmsTemplate(getContact(), getLegal(), articles), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}

import { notFound } from "next/navigation";

// Never prerender or cache unknown paths: bots probe thousands of them.
export const dynamic = "force-dynamic";

export default function CatchAll() {
  notFound();
}

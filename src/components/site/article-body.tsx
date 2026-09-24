import { renderMarkdown, type MarkdownStyle } from "@/lib/markdown";
import styles from "./article-body.module.css";

export function ArticleBody({ markdown }: { markdown: string }) {
  return <div className={styles.body}>{renderMarkdown(markdown, styles as unknown as MarkdownStyle)}</div>;
}

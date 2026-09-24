import type { ReactNode } from "react";

// A small, safe Markdown subset for articles: ## / ### headings, paragraphs, - and 1. lists, > quotes, --- rules,
// **bold**, *italic*, `code` and [links](https://…). Everything is rendered as React elements (text is escaped by
// React), links are limited to http(s), mailto, tel and site-relative paths, and raw HTML is never interpreted.

export type MarkdownStyle = { h2: string; h3: string; p: string; ul: string; ol: string; li: string; quote: string; hr: string; a: string; code: string };

const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i;

const INLINE = /\*\*([^*]+?)\*\*|\*([^*\s][^*]*?)\*|`([^`]+?)`|\[([^\]]+?)\]\(([^)\s]+?)\)/;

function inline(text: string, style: MarkdownStyle, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let n = 0;
  while (rest) {
    const match = INLINE.exec(rest);
    if (!match) {
      nodes.push(rest);
      break;
    }
    if (match.index > 0) nodes.push(rest.slice(0, match.index));
    const key = `${keyBase}-${n++}`;
    if (match[1] !== undefined) nodes.push(<strong key={key}>{inline(match[1], style, key)}</strong>);
    else if (match[2] !== undefined) nodes.push(<em key={key}>{inline(match[2], style, key)}</em>);
    else if (match[3] !== undefined) nodes.push(<code key={key} className={style.code}>{match[3]}</code>);
    else {
      const href = match[5];
      const external = /^https?:\/\//i.test(href);
      nodes.push(
        SAFE_URL.test(href) ? (
          <a key={key} href={href} className={style.a} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {inline(match[4], style, key)}
          </a>
        ) : (
          match[4]
        ),
      );
    }
    rest = rest.slice(match.index + match[0].length);
  }
  return nodes;
}

export function renderMarkdown(markdown: string, style: MarkdownStyle): ReactNode[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const next = () => `b${key++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    if (heading) {
      const k = next();
      const Tag = heading[1].length === 2 ? "h2" : "h3";
      blocks.push(<Tag key={k} className={style[Tag]}>{inline(heading[2].trim(), style, k)}</Tag>);
      i++;
    } else if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push(<hr key={next()} className={style.hr} />);
      i++;
    } else if (/^\s*[-*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const item = ordered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*]\s+(.*)$/;
      const k = next();
      const items: ReactNode[] = [];
      while (i < lines.length && item.test(lines[i])) {
        const ik = `${k}-${items.length}`;
        items.push(<li key={ik} className={style.li}>{inline(item.exec(lines[i])![1], style, ik)}</li>);
        i++;
      }
      blocks.push(ordered ? <ol key={k} className={style.ol}>{items}</ol> : <ul key={k} className={style.ul}>{items}</ul>);
    } else if (/^>\s?/.test(line)) {
      const k = next();
      const quoted: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quoted.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={k} className={style.quote}>{inline(quoted.join(" "), style, k)}</blockquote>);
    } else {
      const k = next();
      const paragraph: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|>\s?|\s*[-*]\s+|\s*\d+[.)]\s+|-{3,}\s*$)/.test(lines[i])) paragraph.push(lines[i++].trim());
      if (paragraph.length === 0) paragraph.push(lines[i++].trim()); // a lone "##" etc.: never stall on a line
      blocks.push(<p key={k} className={style.p}>{inline(paragraph.join(" "), style, k)}</p>);
    }
  }
  return blocks;
}

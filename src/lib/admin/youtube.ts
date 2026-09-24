// Helpers for adding a YouTube video by link: extract and check the id, and fetch a thumbnail.

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** Accepts a Shorts / watch / youtu.be / embed link or a bare 11-character id. */
export function parseYoutubeId(input: string): string | null {
  const value = input.trim();
  if (ID_RE.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.split("/")[1] ?? null;
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const [, kind, second] = url.pathname.split("/");
      if (kind === "watch") id = url.searchParams.get("v");
      else if (kind === "shorts" || kind === "embed" || kind === "live" || kind === "v") id = second ?? null;
    }
    return id && ID_RE.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** "ok" when YouTube knows the video, "missing" when it does not (or it is private), "unreachable" when YouTube could not be asked. */
export async function checkYoutube(id: string): Promise<"ok" | "missing" | "unreachable"> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) return "ok";
    return res.status === 404 || res.status === 401 || res.status === 400 ? "missing" : "unreachable";
  } catch {
    return "unreachable";
  }
}

/** The video's own thumbnail (the largest one YouTube has), or null. */
export async function fetchYoutubeThumbnail(id: string): Promise<Buffer | null> {
  for (const name of ["maxresdefault", "hqdefault"]) {
    try {
      const res = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`, { signal: AbortSignal.timeout(8000) });
      if (res.ok && (res.headers.get("content-type") ?? "").startsWith("image/")) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length > 2000) return buffer;
      }
    } catch {
      // try the next size
    }
  }
  return null;
}

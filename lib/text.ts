export function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function toText(html: string): string {
  const withoutCode = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(withoutCode).replace(/\s+/g, " ").trim();
}

export function paragraphs(html: string): string[] {
  return html
    .split(/<\/p>/i)
    .map((part) => toText(part))
    .filter((part) => part.length > 30);
}

export function hashFromLink(link: string): string {
  return link.match(/\/video\/([^/?#]+)/)?.[1] ?? "";
}

export function authorSlugFromLink(link: string): string {
  return link.match(/\/author\/([^/?#]+)/)?.[1] ?? "";
}

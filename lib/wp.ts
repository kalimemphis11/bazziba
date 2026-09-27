import { unstable_cache } from "next/cache";
import { formatRelative } from "@/lib/format";
import {
  authorSlugFromLink,
  decodeEntities,
  hashFromLink,
  paragraphs,
  toText,
} from "@/lib/text";
import type {
  NavCategory,
  Playback,
  VideoCardData,
  VideoRail,
} from "@/lib/types";

const WP = "https://bazziba.it";

const headers = {
  accept: "application/json",
  "user-agent": "Mozilla/5.0 (compatible; BazzibaDemo/0.1)",
};

type WpVideo = {
  id: number;
  link: string;
  date: string;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
  video_category?: number[];
  contest_taxonomy?: number[];
  author: number;
  _embedded?: {
    author?: { name: string; slug: string; avatar_urls?: Record<string, string> }[];
    "wp:featuredmedia"?: { source_url?: string }[];
    "wp:term"?: { taxonomy: string; id: number; name: string; slug: string }[][];
  };
};

type WpTerm = { id: number; slug: string; name: string; count: number };

type WpContest = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  contest_taxonomy?: number[];
};

async function fetchRetry(url: string, requestHeaders: HeadersInit) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await fetch(url, {
        headers: requestHeaders,
        signal: AbortSignal.timeout(25_000),
      });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

const readJson = unstable_cache(
  async (path: string) => {
    const response = await fetchRetry(`${WP}/wp-json${path}`, headers);
    if (!response.ok) {
      throw new Error(`WordPress ${response.status} ${path}`);
    }
    const totalHeader = response.headers.get("x-wp-total");
    return {
      data: await response.json(),
      total: totalHeader ? Number(totalHeader) : null,
    };
  },
  ["bazziba-wp-json-v2"],
  { revalidate: 60 },
);

const readHtml = unstable_cache(
  async (path: string) => {
    const response = await fetchRetry(`${WP}${path}`, {
      "user-agent": headers["user-agent"],
    });
    if (!response.ok) {
      throw new Error(`Pagina ${response.status} ${path}`);
    }
    return response.text();
  },
  ["bazziba-wp-html-v2"],
  { revalidate: 60 },
);

async function wpFetch<T>(path: string): Promise<{ data: T; total: number | null }> {
  const result = await readJson(path);
  return { data: result.data as T, total: result.total };
}

async function wpHtml(path: string): Promise<string> {
  return readHtml(path);
}

function mapVideo(video: WpVideo): VideoCardData {
  const author = video._embedded?.author?.[0];
  const poster = video._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  return {
    id: video.id,
    hash: hashFromLink(video.link),
    title: toText(video.title.rendered),
    poster,
    duration: null,
    viewsLabel: null,
    authorName: author?.name ?? "Bazziba",
    authorSlug: author?.slug ?? "",
    dateLabel: formatRelative(video.date),
  };
}

function parseArticle(attrs: string, body: string): VideoCardData | null {
  const href = body.match(/href="(https:\/\/bazziba\.it\/video\/[^"]+)"/)?.[1];
  if (!href) return null;
  const poster = body
    .match(/background-image:\s*url\(([^)]+)\)/)?.[1]
    ?.replace(/['"]/g, "");
  const authorHref =
    body.match(/post-meta__author[\s\S]*?href="([^"]+)"/)?.[1] ?? "";
  const views = toText(
    body.match(/post-meta__views[\s\S]*?>([\s\S]*?)<\/div>/)?.[1] ?? "",
  );
  const duration = toText(
    body.match(/video-length[\s\S]*?>([\s\S]*?)<\/div>/)?.[1] ?? "",
  );
  const title = toText(
    body.match(/post-title[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "",
  );
  return {
    id: Number(attrs.match(/post-(\d+)/)?.[1] ?? 0),
    hash: hashFromLink(href),
    title,
    poster: poster ?? null,
    duration: duration || null,
    viewsLabel: views || null,
    authorName:
      toText(body.match(/post-meta__text">([\s\S]*?)<\/span>/)?.[1] ?? "") ||
      "Bazziba",
    authorSlug: authorSlugFromLink(authorHref),
    dateLabel: null,
  };
}

function articlesIn(html: string): VideoCardData[] {
  const videos: VideoCardData[] = [];
  const pattern = /<article\b([^>]*)>([\s\S]*?)<\/article>/gi;
  for (const match of html.matchAll(pattern)) {
    const video = parseArticle(match[1] ?? "", match[2] ?? "");
    if (video?.hash) videos.push(video);
  }
  return videos;
}

const DEMO_RAILS = /^(music|travel|sports)\b/i;

export function parseHome(html: string): {
  featured: VideoCardData[];
  rails: VideoRail[];
} {
  const titlePattern =
    /<h[234][^>]*class="[^"]*widget-title[^"]*"[^>]*>[\s\S]*?<\/h[234]>/gi;
  const marks = [...html.matchAll(titlePattern)];
  const featured = articlesIn(
    marks[0] ? html.slice(0, marks[0].index ?? 0) : html,
  ).slice(0, 8);
  const rails: VideoRail[] = [];
  marks.forEach((mark, index) => {
    const title = toText(mark[0] ?? "").replace(/vedi di più/i, "").trim();
    if (!title || DEMO_RAILS.test(title)) return;
    const start = (mark.index ?? 0) + mark[0].length;
    const end = marks[index + 1]?.index ?? html.length;
    const videos = articlesIn(html.slice(start, end)).slice(0, 12);
    if (videos.length === 0) return;
    rails.push({ title, href: null, videos });
  });
  return { featured, rails };
}

function parseSettings(html: string): string | null {
  for (const match of html.matchAll(/data-settings="([^"]+)"/g)) {
    try {
      const json = JSON.parse(decodeEntities(match[1] ?? "")) as {
        sources?: { src?: string }[];
      };
      const src = json.sources?.[0]?.src;
      if (src?.startsWith("http")) return src;
    } catch {
      continue;
    }
  }
  return null;
}

export async function getCategories(): Promise<NavCategory[]> {
  const { data } = await wpFetch<WpTerm[]>(
    "/wp/v2/video_category?per_page=100&_fields=id,slug,name,count",
  );
  return data.sort((a, b) => b.count - a.count);
}

export async function getCategory(slug: string): Promise<NavCategory | null> {
  const { data } = await wpFetch<WpTerm[]>(
    `/wp/v2/video_category?slug=${encodeURIComponent(slug)}&_fields=id,slug,name,count`,
  );
  return data[0] ?? null;
}

export async function getHome(): Promise<{
  featured: VideoCardData[];
  rails: VideoRail[];
}> {
  const html = await wpHtml("/");
  const parsed = parseHome(html);
  const categories = await getCategories();
  const categoryRails = await Promise.all(
    categories.slice(0, 6).map(async (category) => {
      const videos = await getVideos({
        video_category: String(category.id),
        per_page: "8",
      });
      return {
        title: category.name,
        href: `/categorie/${category.slug}`,
        videos,
      } satisfies VideoRail;
    }),
  );
  return {
    featured: parsed.featured,
    rails: [...parsed.rails, ...categoryRails.filter((rail) => rail.videos.length > 0)],
  };
}

export async function getRail(title: string): Promise<VideoRail | null> {
  const html = await wpHtml("/");
  const rail = parseHome(html).rails.find(
    (item) => item.title.toLowerCase() === title.toLowerCase(),
  );
  return rail ?? null;
}

export async function getVideos(
  params: Record<string, string>,
): Promise<VideoCardData[]> {
  const query = new URLSearchParams({
    per_page: "12",
    _embed: "1",
    ...params,
  });
  const { data } = await wpFetch<WpVideo[]>(`/wp/v2/video?${query}`);
  return data.map(mapVideo).filter((video) => video.hash);
}

export async function getVideoTotal(
  params: Record<string, string>,
): Promise<number | null> {
  const query = new URLSearchParams({ per_page: "1", _fields: "id", ...params });
  const { total } = await wpFetch<unknown[]>(`/wp/v2/video?${query}`);
  return total;
}

export async function getPlayback(hash: string): Promise<Playback | null> {
  const html = await wpHtml(`/video/${encodeURIComponent(hash)}/`);
  const id = Number(
    html.match(/data-parent-post-id="(\d+)"/)?.[1] ??
      html.match(/postid-(\d+)/)?.[1] ??
      0,
  );
  if (!id) return null;
  const views = toText(
    html.match(/post-meta__views[\s\S]*?>([\s\S]*?)<\/div>/)?.[1] ?? "",
  );
  const likes = toText(
    html.match(/like-count[^>]*>([\s\S]*?)</)?.[1] ?? "",
  );
  return {
    id,
    hlsUrl: parseSettings(html),
    viewsLabel: views || null,
    likesLabel: likes || null,
  };
}

export async function getVideo(id: number): Promise<WpVideo | null> {
  try {
    const { data } = await wpFetch<WpVideo>(
      `/wp/v2/video/${id}?_embed=1`,
    );
    return data;
  } catch {
    return null;
  }
}

export function videoTerms(video: WpVideo) {
  return (video._embedded?.["wp:term"] ?? []).flat();
}

export async function getPage(slug: string): Promise<{
  title: string;
  paragraphs: string[];
} | null> {
  const { data } = await wpFetch<
    { title: { rendered: string }; content: { rendered: string } }[]
  >(`/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=title,content`);
  const page = data[0];
  if (!page) return null;
  return {
    title: toText(page.title.rendered),
    paragraphs: paragraphs(page.content.rendered),
  };
}

export async function getContests() {
  const { data } = await wpFetch<WpContest[]>(
    "/wp/v2/contest?per_page=20&_fields=id,slug,date,link,title,content,contest_taxonomy",
  );
  return data
    .map((contest) => ({
      id: contest.id,
      slug: contest.slug,
      title: toText(contest.title.rendered),
      date: contest.date,
      summary: toText(contest.content.rendered),
      termIds: contest.contest_taxonomy ?? [],
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getContest(slug: string) {
  const contests = await getContests();
  const contest = contests.find((item) => item.slug === slug);
  if (!contest) return null;
  let termIds = contest.termIds;
  if (termIds.length === 0) {
    const { data: terms } = await wpFetch<WpTerm[]>(
      "/wp/v2/contest_taxonomy?per_page=50&_fields=id,slug,name,count",
    );
    const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
    const target = norm(slug);
    const term = terms.find((item) => norm(item.slug) === target);
    if (term) termIds = [term.id];
  }
  const videos = termIds[0]
    ? await getVideos({
        contest_taxonomy: String(termIds[0]),
        per_page: "24",
      })
    : [];
  let story: string[] = [];
  try {
    story = paragraphs(await wpHtml(`/contest/${slug}/`)).slice(0, 8);
  } catch {
    story = contest.summary ? [contest.summary] : [];
  }
  return { ...contest, videos, story };
}

export async function getAuthor(slug: string) {
  const { data } = await wpFetch<
    {
      id: number;
      name: string;
      slug: string;
      description: string;
      avatar_urls?: Record<string, string>;
    }[]
  >(
    `/wp/v2/users?slug=${encodeURIComponent(slug)}&_fields=id,name,slug,description,avatar_urls`,
  );
  const user = data[0];
  if (!user) return null;
  const videos = await getVideos({ author: String(user.id), per_page: "24" });
  const total = await getVideoTotal({ author: String(user.id) });
  return {
    id: user.id,
    name: user.name,
    slug: user.slug,
    about: toText(user.description).slice(0, 420),
    avatar: user.avatar_urls?.["96"] ?? user.avatar_urls?.["48"] ?? null,
    videos,
    total,
  };
}

export async function getMembers() {
  const { data, total } = await wpFetch<
    {
      id: number;
      name: string;
      link: string;
      avatar_urls?: Record<string, string> | { full?: string; thumb?: string };
    }[]
  >("/buddypress/v1/members?per_page=24");
  return {
    total,
    members: data.map((member) => {
      const avatars = member.avatar_urls;
      const avatar =
        avatars && "thumb" in avatars
          ? avatars.thumb
          : avatars && "96" in avatars
            ? avatars["96"]
            : null;
      return {
        id: member.id,
        name: member.name,
        slug: authorSlugFromLink(member.link),
        avatar: avatar ?? null,
      };
    }),
  };
}

export async function getComments(postId: number) {
  const { data } = await wpFetch<
    {
      id: number;
      author_name: string;
      date: string;
      content: { rendered: string };
    }[]
  >(
    `/wp/v2/comments?post=${postId}&per_page=20&_fields=id,author_name,date,content`,
  );
  return data.map((comment) => ({
    id: comment.id,
    author: comment.author_name,
    date: comment.date,
    text: toText(comment.content.rendered),
  }));
}

export async function getActivity() {
  try {
    const { data } = await wpFetch<
      {
        id: number;
        name?: string;
        date?: string;
        title?: string;
        content?: { rendered?: string } | string;
      }[]
    >("/buddypress/v1/activity?per_page=8");
    return data
      .map((item) => ({
        id: item.id,
        name: item.name || "Membro",
        date: item.date ?? "",
        text: toText(
          typeof item.content === "string"
            ? item.content
            : (item.content?.rendered ?? item.title ?? ""),
        ),
      }))
      .filter((item) => item.text);
  } catch {
    return [];
  }
}

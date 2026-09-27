import { VideoGrid } from "@/components/video/video-card";
import { formatCount } from "@/lib/format";
import { getVideoTotal, getVideos } from "@/lib/wp";

export const metadata = { title: "Cerca" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const videos = query
    ? await getVideos({ search: query, per_page: "24" })
    : [];
  const total = query ? await getVideoTotal({ search: query }) : null;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Cerca</h1>
      <form action="/cerca" className="mt-4 mb-6 max-w-xl">
        <label htmlFor="search-q" className="sr-only">
          Cerca
        </label>
        <input
          id="search-q"
          name="q"
          defaultValue={query}
          placeholder="Titolo, artista, brano"
          className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm"
        />
      </form>
      {query ? (
        <p className="mb-4 font-mono text-sm tabular-nums text-muted">
          {formatCount(total ?? videos.length)} risultati per “{query}”
        </p>
      ) : (
        <p className="text-sm text-muted">Scrivi un titolo o il nome di un artista.</p>
      )}
      <VideoGrid videos={videos} />
    </>
  );
}

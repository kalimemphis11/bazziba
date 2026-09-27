import Link from "next/link";
import { notFound } from "next/navigation";
import { Player } from "@/components/video/player";
import { VideoRailView } from "@/components/video/video-rail";
import { formatRelative, formatWhen } from "@/lib/format";
import { paragraphs, toText } from "@/lib/text";
import { getComments, getPlayback, getVideo, getVideos, videoTerms } from "@/lib/wp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const playback = await getPlayback(hash).catch(() => null);
  const video = playback ? await getVideo(playback.id) : null;
  const title = video ? toText(video.title.rendered) : "Video";
  return { title };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const playback = await getPlayback(hash).catch(() => null);
  if (!playback) notFound();
  const video = await getVideo(playback.id);
  if (!video) notFound();

  const terms = videoTerms(video);
  const categories = terms.filter((term) =>
    ["categories", "video_category"].includes(term.taxonomy),
  );
  const author = video._embedded?.author?.[0];
  const poster = video._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const description = paragraphs(video.content?.rendered ?? "");
  const relatedCategory = video.video_category?.[0];
  const related = relatedCategory
    ? (
        await getVideos({
          video_category: String(relatedCategory),
          per_page: "8",
        })
      ).filter((item) => item.hash !== hash)
    : [];
  const comments = await getComments(video.id).catch(() => []);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <article>
        <div className="overflow-hidden rounded-xl bg-well">
          {playback.hlsUrl ? (
            <Player src={playback.hlsUrl} poster={poster} />
          ) : (
            <p className="grid aspect-video place-items-center px-6 text-center text-sm text-muted">
              Sorgente non disponibile in questa anteprima.{" "}
              <a className="text-accent" href={`https://bazziba.it/video/${hash}/`}>
                Aprilo sul sito attuale
              </a>
            </p>
          )}
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">
          {toText(video.title.rendered)}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          {author ? (
            <Link href={`/author/${author.slug}`} className="font-medium text-foreground">
              {author.name}
            </Link>
          ) : null}
          {playback.viewsLabel ? <span>{playback.viewsLabel}</span> : null}
          <time dateTime={video.date}>{formatWhen(video.date)}</time>
          <span>Mi piace {playback.likesLabel || "—"} · dopo l&apos;accesso</span>
          <Link href={`/video/${hash}/embed`} className="text-accent">
            Embed
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorie/${category.slug}`}
              className="rounded-full bg-surface px-3 py-1 text-xs text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </div>
        {description.length > 0 ? (
          <div className="mt-4 space-y-3 rounded-xl bg-elevated p-4 text-sm leading-6">
            {description.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Commenti</h2>
          {comments.length === 0 ? (
            <p className="text-sm text-muted">Nessun commento pubblico.</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-xl bg-elevated p-4">
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-xs text-muted">{formatRelative(comment.date)}</p>
                  <p className="mt-2 text-sm leading-6">{comment.text}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
      <aside>
        <VideoRailView rail={{ title: "Correlati", href: null, videos: related }} />
      </aside>
    </div>
  );
}

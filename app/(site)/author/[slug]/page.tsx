import { notFound } from "next/navigation";
import { VideoGrid } from "@/components/video/video-card";
import { formatCount } from "@/lib/format";
import { getAuthor } from "@/lib/wp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthor(slug).catch(() => null);
  return { title: author?.name ?? "Artista" };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthor(slug).catch(() => null);
  if (!author) notFound();

  return (
    <>
      <header className="mb-6 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-surface text-lg font-semibold">
          {author.avatar ? (
            // Avatars are small remote files from WordPress. next/image needs a known host pattern.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={author.avatar} alt="" width={64} height={64} className="h-16 w-16 object-cover" />
          ) : (
            author.name.slice(0, 1)
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{author.name}</h1>
          <p className="font-mono text-sm tabular-nums text-muted">
            {formatCount(author.total ?? author.videos.length)} video
          </p>
        </div>
      </header>
      {author.about ? <p className="mb-6 max-w-2xl text-sm leading-6 text-muted">{author.about}</p> : null}
      <VideoGrid videos={author.videos} />
    </>
  );
}

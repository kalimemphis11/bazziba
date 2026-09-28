import Image from "next/image";
import Link from "next/link";
import type { VideoCardData } from "@/lib/types";

function MetaNumber({ label }: { label: string }) {
  const match = label.match(/^([\d.]+)\s*(.*)$/);
  if (!match) return label;
  return (
    <>
      <span className="font-mono tabular-nums">{match[1]}</span>
      {match[2] ? ` ${match[2]}` : null}
    </>
  );
}

export function VideoCard({
  video,
  priority = false,
}: {
  video: VideoCardData;
  priority?: boolean;
}) {
  const meta = video.viewsLabel || video.dateLabel;
  return (
    <article className="w-full">
      <Link href={`/video/${video.hash}`} className="block rounded-xl">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-surface">
          {video.poster ? (
            <Image
              src={video.poster}
              alt=""
              fill
              sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-accent">
              ▶
            </span>
          )}
          {video.duration ? (
            <span className="absolute right-2 bottom-2 rounded-md bg-well/90 px-1.5 py-0.5 font-mono text-xs tabular-nums text-foreground">
              {video.duration}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-5 text-foreground">
          {video.title}
        </h3>
      </Link>
      <p className="mt-1 truncate text-xs text-muted">
        {video.authorSlug ? (
          <Link
            href={`/author/${video.authorSlug}`}
            className="hover:text-foreground"
          >
            {video.authorName}
          </Link>
        ) : (
          video.authorName
        )}
        {meta ? (
          <>
            <span aria-hidden> · </span>
            {video.viewsLabel ? <MetaNumber label={video.viewsLabel} /> : meta}
          </>
        ) : null}
      </p>
    </article>
  );
}

export function VideoGrid({ videos }: { videos: VideoCardData[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {videos.map((video) => (
        <li key={video.hash} className="min-w-0">
          <VideoCard video={video} />
        </li>
      ))}
    </ul>
  );
}

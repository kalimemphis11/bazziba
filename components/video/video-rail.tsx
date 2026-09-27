import Link from "next/link";
import type { VideoRail } from "@/lib/types";
import { VideoCard } from "@/components/video/video-card";

export function VideoRailView({
  rail,
  priority = false,
}: {
  rail: VideoRail;
  priority?: boolean;
}) {
  if (rail.videos.length === 0) return null;
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{rail.title}</h2>
        {rail.href ? (
          <Link href={rail.href} className="text-sm text-accent">
            Vedi di più
          </Link>
        ) : null}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {rail.videos.map((video, index) => (
          <div key={`${rail.title}-${video.hash}`} className="w-[260px] shrink-0 sm:w-[280px]">
            <VideoCard video={video} priority={priority && index === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}

import { notFound } from "next/navigation";
import { Player } from "@/components/video/player";
import { StreamNotice } from "@/components/video/stream-notice";
import { getPlayback, getVideo } from "@/lib/wp";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const playback = await getPlayback(hash).catch(() => null);
  if (!playback) notFound();
  const video = await getVideo(playback.id);
  const poster = video?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  if (playback.streamStatus === "ready" && playback.hlsUrl) {
    return <Player src={playback.hlsUrl} poster={poster} />;
  }
  return (
    <StreamNotice
      status={playback.streamStatus}
      host={playback.streamHost}
      poster={poster}
    />
  );
}

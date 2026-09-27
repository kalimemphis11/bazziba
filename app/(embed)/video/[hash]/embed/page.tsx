import { notFound } from "next/navigation";
import { Player } from "@/components/video/player";
import { getPlayback, getVideo } from "@/lib/wp";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const playback = await getPlayback(hash).catch(() => null);
  if (!playback?.hlsUrl) notFound();
  const video = await getVideo(playback.id);
  const poster = video?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  return <Player src={playback.hlsUrl} poster={poster} />;
}

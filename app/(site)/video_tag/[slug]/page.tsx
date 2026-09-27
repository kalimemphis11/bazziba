import { notFound } from "next/navigation";
import { VideoGrid } from "@/components/video/video-card";
import { getVideos } from "@/lib/wp";

const TAGS: Record<string, { id: number; title: string }> = {
  "in-evidenza": { id: 197, title: "In evidenza" },
  "vincitori-contest": { id: 208, title: "Vincitori dei contest" },
};

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return params.then(({ slug }) => ({ title: TAGS[slug]?.title ?? "Tag" }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = TAGS[slug];
  if (!tag) notFound();
  const videos = await getVideos({ video_tag: String(tag.id), per_page: "24" });
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{tag.title}</h1>
      <VideoGrid videos={videos} />
    </>
  );
}

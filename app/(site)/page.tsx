import { VideoRailView } from "@/components/video/video-rail";
import { getHome } from "@/lib/wp";

export default async function HomePage() {
  const home = await getHome();
  return (
    <>
      <h1 className="sr-only">Home</h1>
      {home.featured.length > 0 ? (
        <VideoRailView
          priority
          rail={{ title: "In evidenza", href: "/video_tag/in-evidenza", videos: home.featured }}
        />
      ) : null}
      {home.rails.map((rail) => (
        <VideoRailView key={rail.title} rail={rail} />
      ))}
    </>
  );
}

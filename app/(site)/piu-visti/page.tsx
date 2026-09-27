import { VideoGrid } from "@/components/video/video-card";
import { getRail } from "@/lib/wp";

export const metadata = { title: "Più visti" };

export default async function MostViewedPage() {
  const rail = await getRail("Più visti");
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Più visti</h1>
      <VideoGrid videos={rail?.videos ?? []} />
    </>
  );
}

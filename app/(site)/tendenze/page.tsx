import { VideoGrid } from "@/components/video/video-card";
import { getRail } from "@/lib/wp";

export const metadata = { title: "Tendenze" };

export default async function TrendsPage() {
  const rail = await getRail("Tendenze");
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Tendenze</h1>
      <VideoGrid videos={rail?.videos ?? []} />
    </>
  );
}

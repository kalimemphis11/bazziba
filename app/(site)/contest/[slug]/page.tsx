import { notFound } from "next/navigation";
import { VideoGrid } from "@/components/video/video-card";
import { formatWhen } from "@/lib/format";
import { getContest } from "@/lib/wp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contest = await getContest(slug).catch(() => null);
  return { title: contest?.title ?? "Contest" };
}

export default async function ContestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contest = await getContest(slug).catch(() => null);
  if (!contest) notFound();

  return (
    <>
      <header className="mb-6 max-w-3xl">
        <p className="text-sm text-muted">{formatWhen(contest.date)}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{contest.title}</h1>
        <div className="mt-4 space-y-3 text-sm leading-6">
          {contest.story.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Il voto resta sul regolamento attuale. Il pulsante arriva quando leggiamo il tema child, così la classifica non cambia.
        </p>
      </header>
      <VideoGrid videos={contest.videos} />
    </>
  );
}

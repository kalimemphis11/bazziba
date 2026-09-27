import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoGrid } from "@/components/video/video-card";
import { formatCount } from "@/lib/format";
import { getCategory, getVideos } from "@/lib/wp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug).catch(() => null);
  return { title: category?.name ?? "Categoria" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ordine?: string }>;
}) {
  const { slug } = await params;
  const { ordine } = await searchParams;
  const category = await getCategory(slug);
  if (!category) notFound();
  const byComments = ordine === "commenti";
  const videos = await getVideos({
    video_category: String(category.id),
    per_page: "24",
    orderby: byComments ? "comment_count" : "date",
    order: "desc",
  });

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
          <p className="mt-1 font-mono text-sm tabular-nums text-muted">
            {formatCount(category.count)} video
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href={`/categorie/${slug}`}
            className={`rounded-full px-3 py-1 ${byComments ? "text-muted" : "bg-surface text-foreground"}`}
          >
            Più recenti
          </Link>
          <Link
            href={`/categorie/${slug}?ordine=commenti`}
            className={`rounded-full px-3 py-1 ${byComments ? "bg-surface text-foreground" : "text-muted"}`}
          >
            Più commentati
          </Link>
        </div>
      </header>
      <VideoGrid videos={videos} />
    </>
  );
}

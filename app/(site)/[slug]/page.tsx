import { notFound } from "next/navigation";
import { Article } from "@/components/info/article";
import { getPage } from "@/lib/wp";

const PAGES = new Set([
  "cose-bazziba",
  "faq",
  "privacy-policy",
  "cookie-policy",
  "terms",
  "regole-della-community",
  "regolamento-del-contest",
  "contest-di-bazziba",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!PAGES.has(slug)) return { title: "Pagina" };
  const page = await getPage(slug).catch(() => null);
  return { title: page?.title ?? "Pagina" };
}

export default async function InfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!PAGES.has(slug)) notFound();
  const page = await getPage(slug).catch(() => null);
  if (!page) notFound();
  return <Article title={page.title} paragraphs={page.paragraphs} />;
}

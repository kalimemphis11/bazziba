import { AppFrame } from "@/components/shell/app-frame";
import { getCategories } from "@/lib/wp";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories().catch(() => []);
  return <AppFrame categories={categories}>{children}</AppFrame>;
}

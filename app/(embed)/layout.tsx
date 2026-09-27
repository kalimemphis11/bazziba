export const dynamic = "force-dynamic";

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-full bg-well">{children}</div>;
}

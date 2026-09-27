export function Article({
  title,
  paragraphs,
  children,
}: {
  title: string;
  paragraphs?: string[];
  children?: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="space-y-4 text-base leading-7 text-foreground/90">
        {paragraphs?.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        {children}
      </div>
    </article>
  );
}

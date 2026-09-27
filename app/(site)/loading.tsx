export default function Loading() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-7 w-40 rounded-lg bg-surface" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="w-[260px] shrink-0">
            <div className="aspect-video rounded-xl bg-surface" />
            <div className="mt-2 h-4 w-3/4 rounded bg-surface" />
            <div className="mt-2 h-3 w-1/2 rounded bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}

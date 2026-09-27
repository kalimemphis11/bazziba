"use client";

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg py-16">
      <h1 className="text-2xl font-semibold">Contenuto non raggiungibile</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        WordPress non ha risposto. I video non sono stati copiati in questa anteprima.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
      >
        Riprova
      </button>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <h1 className="text-2xl font-semibold">Pagina non trovata</h1>
      <p className="mt-3 text-sm text-muted">
        Questo indirizzo non ha un video o una pagina pubblica.
      </p>
      <Link href="/" className="mt-6 inline-block text-accent">
        Torna alla home
      </Link>
    </div>
  );
}

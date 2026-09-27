"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavCategory } from "@/lib/types";

const INFO = [
  { href: "/cose-bazziba", label: "Cos'è Bazziba" },
  { href: "/faq", label: "FAQ" },
  { href: "/regolamento-del-contest", label: "Regolamento contest" },
  { href: "/regole-della-community", label: "Regole" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/cookie-policy", label: "Cookie" },
  { href: "/terms", label: "Termini" },
];

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block rounded-lg px-3 py-2 text-sm ${active ? "bg-surface text-foreground" : "text-muted hover:bg-surface hover:text-foreground"}`}
    >
      {label}
    </Link>
  );
}

export function AppFrame({
  categories,
  children,
}: {
  categories: NavCategory[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-line bg-background/95">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4">
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm text-muted md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Image
              src="https://bazziba.it/wp-content/uploads/2025/01/icona.png"
              alt=""
              width={36}
              height={36}
              priority
              className="rounded-lg"
            />
            BAZZIBA
          </Link>
          <form action="/cerca" className="mx-auto hidden min-w-0 flex-1 md:block md:max-w-xl">
            <label htmlFor="q" className="sr-only">
              Cerca video e artisti
            </label>
            <input
              id="q"
              name="q"
              placeholder="Cerca video e artisti"
              className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted"
            />
          </form>
          <nav className="ml-auto flex items-center gap-2 text-sm">
            <Link href="/area-personale" className="hidden rounded-full bg-accent px-3 py-2 font-medium text-accent-ink sm:inline">
              Carica
            </Link>
            <Link href="/messaggi" className="rounded-full px-3 py-2 text-muted hover:text-foreground">
              Messaggi
            </Link>
            <Link href="/accedi" className="rounded-full border border-line px-3 py-2">
              Accedi
            </Link>
          </nav>
        </div>
        <form action="/cerca" className="px-4 pb-3 md:hidden">
          <label htmlFor="q-mobile" className="sr-only">
            Cerca video e artisti
          </label>
          <input
            id="q-mobile"
            name="q"
            placeholder="Cerca video e artisti"
            className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm"
          />
        </form>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="Chiudi menu"
          className="fixed inset-0 z-30 bg-well/70 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex w-full max-w-[1500px]">
        <aside
          className={
            open
              ? "fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-elevated px-3 py-4 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-60 md:bg-background"
              : "sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto px-3 py-4 md:block"
          }
        >
          <nav className="space-y-1">
            <NavLink href="/" label="Home" pathname={pathname} onNavigate={close} />
            <NavLink href="/tendenze" label="Tendenze" pathname={pathname} onNavigate={close} />
            <NavLink href="/piu-visti" label="Più visti" pathname={pathname} onNavigate={close} />
            <NavLink href="/contest" label="Contest" pathname={pathname} onNavigate={close} />
            <NavLink href="/membri" label="Membri" pathname={pathname} onNavigate={close} />
            <NavLink href="/gruppi" label="Gruppi" pathname={pathname} onNavigate={close} />
            <NavLink href="/messaggi" label="Messaggi" pathname={pathname} onNavigate={close} />
            <NavLink href="/punti" label="Punti" pathname={pathname} onNavigate={close} />
          </nav>
          <h2 className="mt-6 mb-2 px-3 text-xs font-medium tracking-wide text-muted uppercase">
            Categorie
          </h2>
          <nav className="space-y-1">
            {categories.map((category) => (
              <NavLink
                key={category.id}
                href={`/categorie/${category.slug}`}
                label={category.name}
                pathname={pathname}
                onNavigate={close}
              />
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 px-4 py-6 md:px-6">{children}</div>
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-start md:justify-between">
          <p>
            Sorridi con Bazziba.
            <span className="mt-1 block text-xs">
              Anteprima Next.js. Video e account restano su WordPress.
            </span>
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {INFO.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

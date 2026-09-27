import { formatRelative } from "@/lib/format";
import { getActivity } from "@/lib/wp";

export const metadata = { title: "Gruppi" };

export default async function GroupsPage() {
  const activity = await getActivity();
  return (
    <article className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Gruppi</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        I gruppi BuddyPress restano nel backend WordPress. L&apos;API pubblica non elenca i gruppi, quindi la directory completa è ancora su{" "}
        <a className="text-accent" href="https://bazziba.it/gruppi/">
          bazziba.it/gruppi
        </a>
        . Qui sotto c&apos;è l&apos;attività pubblica della community.
      </p>
      <ul className="mt-6 space-y-3">
        {activity.map((item) => (
          <li key={item.id} className="rounded-xl bg-elevated p-4">
            <p className="text-sm font-medium">{item.name}</p>
            {item.date ? (
              <p className="text-xs text-muted">{formatRelative(item.date)}</p>
            ) : null}
            <p className="mt-2 text-sm leading-6">{item.text.slice(0, 280)}</p>
          </li>
        ))}
      </ul>
      {activity.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Nessuna attività pubblica in questo momento.</p>
      ) : null}
    </article>
  );
}

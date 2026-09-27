import Link from "next/link";
import { formatWhen } from "@/lib/format";
import { getContests } from "@/lib/wp";

export const metadata = { title: "Contest" };

export default async function ContestIndexPage() {
  const contests = await getContests();
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Contest</h1>
      <ul className="grid gap-4 md:grid-cols-2">
        {contests.map((contest) => (
          <li key={contest.id}>
            <Link href={`/contest/${contest.slug}`} className="block rounded-xl bg-elevated p-5">
              <h2 className="text-lg font-semibold">{contest.title}</h2>
              <p className="mt-1 text-sm text-muted">{formatWhen(contest.date)}</p>
              {contest.summary ? (
                <p className="mt-3 line-clamp-3 text-sm leading-6">{contest.summary}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

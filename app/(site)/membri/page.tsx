import Link from "next/link";
import { formatCount } from "@/lib/format";
import { getMembers } from "@/lib/wp";

export const metadata = { title: "Membri" };

export default async function MembersPage() {
  const { members, total } = await getMembers();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Membri</h1>
      <p className="mt-1 mb-6 font-mono text-sm tabular-nums text-muted">
        {formatCount(total ?? members.length)} profili
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((member) => (
          <li key={member.id}>
            {member.slug ? (
              <Link href={`/author/${member.slug}`} className="flex items-center gap-3 rounded-xl bg-elevated p-3">
                <MemberMark name={member.name} avatar={member.avatar} />
                <span className="line-clamp-2 text-sm font-medium">{member.name}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-elevated p-3">
                <MemberMark name={member.name} avatar={member.avatar} />
                <span className="line-clamp-2 text-sm font-medium">{member.name}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

function MemberMark({ name, avatar }: { name: string; avatar: string | null }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-surface text-sm">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" width={40} height={40} className="h-10 w-10 object-cover" />
      ) : (
        name.slice(0, 1)
      )}
    </span>
  );
}

import { Article } from "@/components/info/article";
import { getPage } from "@/lib/wp";

export const metadata = { title: "Punti" };

export default async function PointsPage() {
  const page = await getPage("buy-points").catch(() => null);
  return (
    <Article title="Punti" paragraphs={page?.paragraphs}>
      <p>
        L&apos;acquisto punti resta sul checkout WordPress finché il login di questa anteprima non è collegato.
      </p>
      <p>
        <a className="text-accent" href="https://bazziba.it/buy-points/">
          Apri Buy Points sul sito attuale
        </a>
      </p>
    </Article>
  );
}

import { Article } from "@/components/info/article";
import { getPage } from "@/lib/wp";

export const metadata = { title: "Messaggi" };

export default async function MessagesPage() {
  const page = await getPage("messaggi").catch(() => null);
  return (
    <Article title="Messaggi" paragraphs={page?.paragraphs}>
      <p>
        La chat è Better Messages, ed è usata dai membri. In questa anteprima si apre ancora sul sito attuale, con lo stesso account WordPress.
      </p>
      <p>
        <a className="text-accent" href="https://bazziba.it/messaggi/">
          Apri i messaggi su bazziba.it
        </a>
      </p>
    </Article>
  );
}

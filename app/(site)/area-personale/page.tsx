import { Article } from "@/components/info/article";

export const metadata = { title: "Area personale" };

export default function StudioPage() {
  return (
    <Article title="Carica un video">
      <p>
        I nuovi video vengono pubblicati subito, senza coda di approvazione. Il file va su Bunny e il post resta su WordPress.
      </p>
      <p>
        Il caricamento da questa anteprima si accende insieme al plugin headless. Fino ad allora si usa la pagina di upload attuale.
      </p>
      <p>
        <a className="text-accent" href="https://bazziba.it/wp-login.php">
          Apri l&apos;upload sul sito attuale
        </a>
      </p>
    </Article>
  );
}

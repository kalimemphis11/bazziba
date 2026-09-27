import { Article } from "@/components/info/article";

export const metadata = { title: "Accedi" };

export default function LoginPage() {
  return (
    <Article title="Accedi">
      <p>
        Gli account restano quelli di WordPress. Questa anteprima non chiede ancora la password: il ponte di sessione arriva quando il frontend è approvato.
      </p>
      <p>
        <a className="text-accent" href="https://bazziba.it/wp-login.php">
          Entra su bazziba.it
        </a>
      </p>
    </Article>
  );
}

import Image from "next/image";
import type { StreamStatus } from "@/lib/types";

export function StreamNotice({
  status,
  host,
  poster,
}: {
  status: StreamStatus;
  host: string | null;
  poster: string | null;
}) {
  const message =
    status === "suspended"
      ? `Il file è su Bunny Stream${host ? ` (${host})` : ""} e quel dominio risponde che è sospeso. Il video torna quando l'host viene riattivato.`
      : "Non trovo un file riproducibile per questo video.";

  return (
    <div className="relative grid aspect-video place-items-center overflow-hidden bg-well">
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 960px, 100vw"
          className="object-cover opacity-35"
        />
      ) : null}
      <p className="relative max-w-md px-6 text-center text-sm leading-6 text-foreground">
        {message}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export function Player({
  src,
  poster,
}: {
  src: string;
  poster?: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let cancelled = false;
    let hls: { destroy: () => void } | null = null;

    const start = async () => {
      const hlsModule = await import("hls.js");
      if (cancelled) return;
      const Factory = hlsModule.default;
      if (Factory.isSupported()) {
        const instance = new Factory();
        instance.on(Factory.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;
          instance.destroy();
          hls = null;
          setFailure(
            data.type === Factory.ErrorTypes.NETWORK_ERROR
              ? "Il file video non risponde."
              : "Questo video non si può riprodurre.",
          );
        });
        if (cancelled) {
          instance.destroy();
          return;
        }
        instance.loadSource(src);
        instance.attachMedia(video);
        hls = instance;
        return;
      }
      video.src = src;
    };

    void start();
    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className="relative">
      <video
        ref={ref}
        poster={poster ?? undefined}
        controls
        playsInline
        preload="metadata"
        aria-label="Lettore video"
        className="aspect-video w-full bg-well"
      />
      {failure ? (
        <p className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-sm leading-6 text-foreground">
          {failure}
        </p>
      ) : null}
    </div>
  );
}

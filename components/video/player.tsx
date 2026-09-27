"use client";

import { useEffect, useRef } from "react";

export function Player({
  src,
  poster,
}: {
  src: string;
  poster?: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);

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
    <video
      ref={ref}
      poster={poster ?? undefined}
      controls
      playsInline
      preload="metadata"
      aria-label="Lettore video"
      className="aspect-video w-full bg-well"
    />
  );
}

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
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return;
      }
      const hlsModule = await import("hls.js");
      if (cancelled) return;
      const Factory = hlsModule.default;
      if (!Factory.isSupported()) return;
      const instance = new Factory();
      instance.loadSource(src);
      instance.attachMedia(video);
      hls = instance;
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

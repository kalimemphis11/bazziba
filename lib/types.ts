export type VideoCardData = {
  id: number;
  hash: string;
  title: string;
  poster: string | null;
  duration: string | null;
  viewsLabel: string | null;
  authorName: string;
  authorSlug: string;
  dateLabel: string | null;
};

export type VideoRail = {
  title: string;
  href: string | null;
  videos: VideoCardData[];
};

export type NavCategory = {
  id: number;
  slug: string;
  name: string;
  count: number;
};

export type StreamStatus = "ready" | "suspended" | "unavailable";

export type Playback = {
  id: number;
  hlsUrl: string | null;
  streamStatus: StreamStatus;
  streamHost: string | null;
  viewsLabel: string | null;
  likesLabel: string | null;
};

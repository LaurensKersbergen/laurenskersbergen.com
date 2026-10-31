import type { Metadata } from "next";
import Image from "next/image";
import { getRecentlyPlayed, RecentlyPlayedItem } from "@/lib/spotify";

export const metadata: Metadata = {
  title: "Listening",
  description: "What I've been listening to on Spotify.",
};

export const revalidate = 60; // Revalidate every 60 seconds

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function TrackItem({ item }: { item: RecentlyPlayedItem }) {
  const { track, played_at } = item;
  const albumImage = track.album.images[1] || track.album.images[0]; // Use medium size (300x300) or fallback to largest

  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 border-b border-(--border) py-3 no-underline!"
    >
      {albumImage && (
        <Image
          src={albumImage.url}
          alt={`${track.album.name} album art`}
          width={56}
          height={56}
          className="shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-row truncate text-(--fg) underline-offset-4 group-hover:underline">{track.name}</p>
        <p className="truncate text-base text-(--muted)">{track.artists.map((a) => a.name).join(", ")}</p>
      </div>
      <span className="shrink-0 text-base text-(--muted) tabular-nums">{formatTimeAgo(played_at)}</span>
    </a>
  );
}

export default async function ListeningPage() {
  let tracks: RecentlyPlayedItem[] = [];
  let error: string | null = null;

  try {
    tracks = await getRecentlyPlayed(50);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load tracks";
  }

  return (
    <div className="page-column">
      <h1 className="text-title my-6.5">Listening</h1>

      <p className="mb-7 text-(--muted)">Recently played on Spotify.</p>

      {error ? (
        <p className="text-(--muted)">Unable to load listening history. Please try again later.</p>
      ) : tracks.length === 0 ? (
        <p className="text-(--muted)">No recent tracks found.</p>
      ) : (
        <div>
          {tracks.map((item, index) => (
            <TrackItem key={`${item.track.name}-${item.played_at}-${index}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

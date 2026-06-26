"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import PhotoGrid from "@/components/PhotoGrid";
import CornerOrnament from "@/components/CornerOrnament";

interface MediaItem {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
  folder: string;
  bytes: number;
}

export default function AlbumDetailPage({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album } = use(params);
  const albumName = decodeURIComponent(album);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch(
          `/api/media?folder=gunawan-farm/${albumName}`
        );
        const data = await res.json();
        setMedia(data.media || []);
      } catch {
        setMedia([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, [albumName]);

  return (
    <div className="min-h-screen pt-20 pb-16 px-[2vw] sm:px-[3vw]">
      <div className="mb-14">
        <Link
          href="/albums"
          className="inline-flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-[--color-text-muted] hover:text-[--color-text] mb-8 transition-colors duration-500 font-bold"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Albums
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] capitalize leading-[0.85]">
          {albumName.replace(/-/g, " ")}
        </h1>
        <p className="text-[9px] tracking-[0.4em] uppercase text-[--color-text-muted] mt-4 font-bold">
          {media.length} memories
        </p>
      </div>

      <div className="relative py-8">
        <CornerOrnament />
        <div className="px-4 sm:px-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[--color-surface] animate-pulse aspect-[4/3]" />
              ))}
            </div>
          ) : (
            <PhotoGrid items={media} />
          )}
        </div>
      </div>
    </div>
  );
}

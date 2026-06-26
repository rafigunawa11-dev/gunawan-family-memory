"use client";

import { useState, useEffect } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import Carousel3D from "@/components/Carousel3D";
import Lightbox from "@/components/Lightbox";
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

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselLightbox, setCarouselLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data.media || []);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="px-[2vw] sm:px-[3vw] mb-10 animate-fade-in-up">
        <p className="text-[9px] tracking-[0.4em] uppercase text-[--color-text-muted] mb-4 font-bold">
          Collection — {media.length} memories
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.02em] leading-[0.85]">
          Semua
        </h1>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium italic tracking-[-0.02em] leading-[0.85] mt-1">
          Kenangan
        </h1>
      </div>

      {/* 3D Carousel */}
      {!loading && media.length > 0 && (
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <Carousel3D
            items={media}
            onSelect={(index) => setCarouselLightbox(index)}
          />
        </div>
      )}

      {/* Masonry grid */}
      <div className="px-[2vw] sm:px-[3vw]">
        <div className="relative py-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <CornerOrnament />
          <div className="px-4 sm:px-8">
            {loading ? (
              <div className="masonry-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[--color-surface] animate-pulse"
                    style={{ height: `${200 + (i % 3) * 80}px` }}
                  />
                ))}
              </div>
            ) : (
              <PhotoGrid items={media} />
            )}
          </div>
        </div>
      </div>

      {/* Carousel lightbox */}
      {carouselLightbox !== null && (
        <Lightbox
          items={media}
          currentIndex={carouselLightbox}
          onClose={() => setCarouselLightbox(null)}
          onNavigate={setCarouselLightbox}
        />
      )}
    </div>
  );
}

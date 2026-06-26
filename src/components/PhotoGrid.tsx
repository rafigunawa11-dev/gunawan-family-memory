"use client";

import { useState, useEffect, useRef } from "react";
import Lightbox from "./Lightbox";
import CornerOrnament from "./CornerOrnament";

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

interface PhotoGridProps {
  items: MediaItem[];
  onDeleted?: () => void;
}

export default function PhotoGrid({ items, onDeleted }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDelete = async (publicId: string, resourceType: string) => {
    const res = await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId, resourceType }),
    });
    if (res.ok) {
      setLightboxIndex(null);
      onDeleted?.();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const items = gridRef.current?.querySelectorAll(".scroll-reveal");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
        <div className="relative p-8 sm:p-16 text-center">
          <CornerOrnament />
          <p className="text-[9px] tracking-[0.4em] uppercase text-[--color-text-muted] mb-4 font-bold">
            Empty
          </p>
          <p className="font-display text-xl text-[--color-text]">
            Belum ada kenangan
          </p>
          <p className="text-xs mt-4 text-[--color-text-muted] tracking-wide">
            Upload foto & video pertama keluarga
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid" ref={gridRef}>
        {items.map((item, index) => (
          <div
            key={item.public_id}
            className="scroll-reveal group relative cursor-pointer overflow-hidden bg-[--color-surface]"
            style={{ transitionDelay: `${Math.min(index * 40, 400)}ms` }}
            onClick={() => setLightboxIndex(index)}
          >
            {item.resource_type === "video" ? (
              <div className="relative">
                <video
                  src={item.secure_url}
                  className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 border border-white/40 flex items-center justify-center group-hover:border-white/80 group-hover:scale-110 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-white ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={item.secure_url}
                alt=""
                className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                loading="lazy"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/80">
                {new Date(item.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

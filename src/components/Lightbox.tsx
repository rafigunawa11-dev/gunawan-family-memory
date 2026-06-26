"use client";

import { useEffect, useCallback } from "react";

interface LightboxProps {
  items: Array<{
    secure_url: string;
    resource_type: string;
    public_id: string;
    width: number;
    height: number;
  }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const item = items[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < items.length - 1)
        onNavigate(currentIndex + 1);
    },
    [currentIndex, items.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[--color-bg]/98 flex items-center justify-center animate-fade-in">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-[11px] tracking-[0.2em] uppercase text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-300"
      >
        Close
      </button>

      {/* Prev */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-6 z-10 text-[11px] tracking-[0.2em] uppercase text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-300"
        >
          Prev
        </button>
      )}

      {/* Next */}
      {currentIndex < items.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-6 z-10 text-[11px] tracking-[0.2em] uppercase text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-300"
        >
          Next
        </button>
      )}

      {/* Media */}
      <div className="max-w-[85vw] max-h-[85vh] flex items-center justify-center">
        {item.resource_type === "video" ? (
          <video
            src={item.secure_url}
            controls
            autoPlay
            className="max-w-full max-h-[85vh]"
          />
        ) : (
          <img
            src={item.secure_url}
            alt=""
            className="max-w-full max-h-[85vh] object-contain"
          />
        )}
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.3em] text-[--color-text-muted]">
        {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </div>
    </div>
  );
}

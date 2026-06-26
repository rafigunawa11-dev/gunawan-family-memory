"use client";

import { useEffect, useCallback, useState } from "react";

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
  onDelete?: (publicId: string, resourceType: string) => void;
}

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
  onDelete,
}: LightboxProps) {
  const item = items[currentIndex];
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 text-[11px] tracking-[0.2em] uppercase text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-300"
      >
        Close
      </button>

      {/* Prev */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 sm:left-6 z-10 text-[11px] tracking-[0.2em] uppercase text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-300"
        >
          Prev
        </button>
      )}

      {/* Next */}
      {currentIndex < items.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 sm:right-6 z-10 text-[11px] tracking-[0.2em] uppercase text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-300"
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

      {/* Delete */}
      {onDelete && (
        <button
          onClick={() => setShowConfirm(true)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 text-[11px] tracking-[0.2em] uppercase text-red-400/60 hover:text-red-400 transition-colors duration-300"
        >
          Hapus
        </button>
      )}

      {/* Delete confirmation */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center animate-fade-in">
          <div className="text-center p-8">
            <p className="font-display text-lg text-[--color-text] mb-2">Hapus kenangan ini?</p>
            <p className="text-[11px] tracking-[0.2em] text-[--color-text-muted] mb-8">Tidak bisa dikembalikan</p>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="text-[11px] tracking-[0.2em] uppercase text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-300"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  setDeleting(true);
                  await onDelete!(item.public_id, item.resource_type);
                  setDeleting(false);
                  setShowConfirm(false);
                }}
                disabled={deleting}
                className="text-[11px] tracking-[0.2em] uppercase text-red-400 hover:text-red-300 transition-colors duration-300"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.3em] text-[--color-text-muted]">
        {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </div>
    </div>
  );
}

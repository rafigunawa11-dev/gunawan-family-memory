"use client";

import { useState, useEffect } from "react";
import AlbumCard from "@/components/AlbumCard";
import CornerOrnament from "@/components/CornerOrnament";

interface Album {
  name: string;
  path: string;
  count: number;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    setLoading(true);
    try {
      const res = await fetch("/api/media?type=albums");
      const data = await res.json();
      setAlbums(data.albums || []);
    } catch {
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }

  async function createAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim().toLowerCase().replace(/\s+/g, "-"),
        }),
      });
      setNewName("");
      setShowCreate(false);
      fetchAlbums();
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 mb-10 sm:mb-16 animate-fade-in-up">
        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase text-[--color-text-muted] mb-4 font-bold">
            Organized
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-6xl font-medium tracking-[-0.02em] leading-[0.85]">
            Albums
          </h1>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 sm:px-6 py-2 sm:py-2.5 border border-[--color-text-light] text-[--color-text-light] text-[9px] tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold hover:bg-[--color-text-light] hover:text-[--color-bg] transition-all duration-500 cursor-pointer active:scale-[0.98] shrink-0"
        >
          + New Album
        </button>
      </div>

      {showCreate && (
        <form onSubmit={createAlbum} className="mb-12 flex gap-4 animate-slide-down">
          <label htmlFor="album-name" className="sr-only">Nama album</label>
          <input
            id="album-name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Album name (e.g. Lebaran 2025)"
            className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-[--color-text-muted]/30 text-[--color-text] placeholder:text-[--color-text-muted]/40 focus:outline-none focus:border-[--color-text] transition-colors duration-500 text-sm tracking-wide"
            autoFocus
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="px-8 py-3 border border-[--color-accent] text-[--color-accent] text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-[--color-accent] hover:text-[--color-bg] disabled:opacity-20 transition-all duration-500 cursor-pointer"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[--color-surface] animate-pulse h-40" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="flex items-center justify-center py-32 animate-fade-in-up">
          <div className="relative p-8 sm:p-16 text-center">
            <CornerOrnament />
            <p className="text-[9px] tracking-[0.4em] uppercase text-[--color-text-muted] mb-4 font-bold">
              Empty
            </p>
            <p className="font-display text-xl text-[--color-text]">
              Belum ada album
            </p>
            <p className="text-xs mt-4 text-[--color-text-muted] tracking-wide">
              Buat album pertama untuk mengorganisir kenangan
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, i) => (
            <div
              key={album.path}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <AlbumCard {...album} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

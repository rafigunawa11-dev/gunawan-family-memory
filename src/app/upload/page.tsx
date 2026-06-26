"use client";

import { useState, useEffect } from "react";
import UploadDropzone from "@/components/UploadDropzone";
import CornerOrnament from "@/components/CornerOrnament";

interface Album {
  name: string;
  path: string;
}

export default function UploadPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState("umum");
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await fetch("/api/media?type=albums");
        const data = await res.json();
        setAlbums(data.albums || []);
      } catch {
        setAlbums([]);
      }
    }
    fetchAlbums();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-14 animate-fade-in-up">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[--color-text-muted] mb-4 font-bold">
            Add New
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-[-0.02em] leading-[0.85]">
            Upload
          </h1>
          <h1 className="font-display text-4xl sm:text-5xl font-medium italic tracking-[-0.02em] leading-[0.85] mt-1">
            Kenangan
          </h1>
        </div>

        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <label htmlFor="album-select" className="block text-[9px] tracking-[0.3em] uppercase text-[--color-text-muted] mb-4 font-bold">
            Select Album
          </label>
          <select
            id="album-select"
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="w-full px-0 py-3 bg-transparent border-0 border-b border-[--color-text-muted]/30 text-[--color-text] focus:outline-none focus:border-[--color-text] transition-colors duration-500 text-sm tracking-wide cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7A6E' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
          >
            <option value="umum">Umum</option>
            {albums.map((a) => (
              <option key={a.path} value={a.name}>
                {a.name.replace(/-/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="relative py-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <CornerOrnament />
          <div className="px-4 sm:px-8">
            <UploadDropzone
              key={uploadKey}
              album={selectedAlbum}
              onUploadComplete={() => setUploadKey((k) => k + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

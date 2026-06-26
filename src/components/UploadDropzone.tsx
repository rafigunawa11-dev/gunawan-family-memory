"use client";

import { useState, useCallback, useRef } from "react";

interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
}

interface UploadDropzoneProps {
  album: string;
  onUploadComplete: () => void;
}

export default function UploadDropzone({
  album,
  onUploadComplete,
}: UploadDropzoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "pending" as const,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function uploadAll() {
    setUploading(true);
    const pending = files.filter((f) => f.status === "pending");

    for (let i = 0; i < pending.length; i++) {
      const fileIndex = files.findIndex((f) => f === pending[i]);
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === fileIndex ? { ...f, status: "uploading" } : f
        )
      );

      try {
        const sigRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: album }),
        });
        const { timestamp, signature, folder, cloudName, apiKey } =
          await sigRes.json();

        const formData = new FormData();
        formData.append("file", pending[i].file);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);
        formData.append("api_key", apiKey);

        const resourceType = pending[i].file.type.startsWith("video/")
          ? "video"
          : "image";

        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
        );

        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setFiles((prev) =>
                prev.map((f, idx) =>
                  idx === fileIndex ? { ...f, progress: pct } : f
                )
              );
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              setFiles((prev) =>
                prev.map((f, idx) =>
                  idx === fileIndex
                    ? { ...f, status: "done", progress: 100 }
                    : f
                )
              );
              resolve();
            } else {
              reject(new Error("Upload failed"));
            }
          };

          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.send(formData);
        });
      } catch {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === fileIndex ? { ...f, status: "error" } : f
          )
        );
      }
    }

    setUploading(false);
    onUploadComplete();
  }

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-8">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed p-16 text-center cursor-pointer transition-all duration-300 ${
          dragging
            ? "border-[--color-accent] bg-[--color-accent]/5"
            : "border-[--color-border] hover:border-[--color-text-muted]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <svg
          className="w-8 h-8 mx-auto text-[--color-text-muted] mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="text-[--color-text] text-sm tracking-wide">
          Drag & drop foto atau video
        </p>
        <p className="text-[--color-text-muted] text-xs mt-2 tracking-wide">
          atau klik untuk pilih file
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {files.map((f, i) => (
              <div key={i} className="relative group overflow-hidden bg-[--color-surface] aspect-square">
                {f.file.type.startsWith("video/") ? (
                  <video
                    src={f.preview}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={f.preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}

                {f.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-sm font-medium tracking-wider">
                      {f.progress}%
                    </span>
                  </div>
                )}

                {f.status === "done" && (
                  <div className="absolute inset-0 bg-[--color-success]/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[--color-success]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {f.status === "error" && (
                  <div className="absolute inset-0 bg-[--color-destructive]/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[--color-destructive]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}

                {f.status === "pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {f.status === "uploading" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
                    <div
                      className="h-full bg-[--color-accent] transition-all duration-300"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {pendingCount > 0 && (
            <button
              onClick={uploadAll}
              disabled={uploading}
              className="w-full py-3.5 border border-[--color-text] text-[--color-text] text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-[--color-text] hover:text-[--color-bg] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${pendingCount} file`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import CornerOrnament from "./CornerOrnament";

interface AlbumCardProps {
  name: string;
  path: string;
  count: number;
}

export default function AlbumCard({ name, path, count }: AlbumCardProps) {
  return (
    <Link
      href={`/albums/${encodeURIComponent(name)}`}
      className="group relative block border border-[--color-border] p-8 hover:border-[--color-text-muted] transition-all duration-500 cursor-pointer"
    >
      <CornerOrnament />
      <p className="text-[9px] tracking-[0.4em] uppercase text-[--color-text-muted] mb-4 font-bold">
        {count} {count === 1 ? "memory" : "memories"}
      </p>
      <h3 className="font-display text-xl font-medium text-[--color-text] capitalize group-hover:text-[--color-accent] transition-colors duration-500">
        {name.replace(/-/g, " ")}
      </h3>
      <div className="w-6 h-px bg-[--color-border] mt-6 group-hover:w-12 group-hover:bg-[--color-accent] transition-all duration-500" />
    </Link>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TextScramble from "./TextScramble";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  }

  const links = [
    { href: "/gallery", label: "Gallery" },
    { href: "/albums", label: "Albums" },
    { href: "/upload", label: "Upload" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference pointer-events-none text-[--color-text-light] animate-fade-in">
      <div className="flex items-start justify-between px-[2vw] pt-[1.2vw]">
        {/* Left: Brand */}
        <Link href="/gallery" className="pointer-events-auto cursor-pointer">
          <TextScramble text="GFM" className="text-[10px] sm:text-[11px] font-extrabold" />
        </Link>

        {/* Center: Time */}
        <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] tabular-nums">
          {time}
        </div>

        {/* Right: Nav */}
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-opacity duration-500 cursor-pointer ${
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
                }`}
              >
                <TextScramble text={link.label} className="text-[10px] sm:text-[11px] font-extrabold" />
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="opacity-50 hover:opacity-100 transition-opacity duration-500 cursor-pointer"
            aria-label="Keluar"
          >
            <TextScramble text="Exit" className="text-[10px] sm:text-[11px] font-extrabold" />
          </button>
        </div>
      </div>
    </nav>
  );
}

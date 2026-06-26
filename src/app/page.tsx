"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CornerOrnament from "@/components/CornerOrnament";
import TextScramble from "@/components/TextScramble";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/gallery");
      } else {
        setError("Password salah. Coba lagi ya!");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 relative overflow-hidden min-h-screen">
      <div className="w-full max-w-md relative z-10">
        <div className="relative p-6 sm:p-12 md:p-16">
          <CornerOrnament />

          {/* Title */}
          <div className="text-center mb-8 sm:mb-14 animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <TextScramble text="Private Family Archive" className="text-[10px] font-semibold" />
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] text-[--color-text] leading-[0.9]">
              Gunawan
            </h1>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-medium italic tracking-[-0.02em] text-[--color-text] leading-[0.9] mt-1">
              Fam Memory
            </h1>
            <div className="w-16 h-px bg-[--color-text-muted]/30 mx-auto mt-10 animate-line-expand" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div>
              <label htmlFor="password" className="block text-[10px] tracking-[0.3em] uppercase text-[--color-text-muted] mb-4 font-bold">
                Family Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-[--color-text-muted]/30 text-[--color-text] placeholder:text-[--color-text-muted]/40 focus:outline-none focus:border-[--color-text] transition-colors duration-500 text-sm tracking-wide"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-[--color-destructive] text-xs tracking-wide text-center animate-scale-in" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 border border-[--color-text-light] text-[--color-text-light] text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[--color-text-light] hover:text-[--color-bg] focus:outline-none disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-500 cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Enter"
              )}
            </button>
          </form>

          <p className="text-center text-[--color-text-muted] text-[9px] tracking-[0.3em] uppercase mt-8 sm:mt-14 font-semibold">
            Keluarga Gunawan Only
          </p>
        </div>
      </div>
    </div>
  );
}

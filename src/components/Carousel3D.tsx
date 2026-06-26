"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  created_at: string;
}

interface Carousel3DProps {
  items: CarouselItem[];
  onSelect: (index: number) => void;
}

export default function Carousel3D({ items, onSelect }: Carousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.floor(items.length / 2), items.length - 1)
  );

  const toPrev = () => setActiveIndex((prev) => Math.max(0, prev - 1));
  const toNext = () => setActiveIndex((prev) => Math.min(items.length - 1, prev + 1));
  const toSlide = (index: number) => setActiveIndex(index);

  if (items.length === 0) return null;

  return (
    <div className="select-none">
      {/* Carousel wrapper */}
      <div className="w-[120px] sm:w-[180px] md:w-[200px] mx-auto mt-8">
        {/* Slides container */}
        <motion.div
          className="flex w-fit"
          animate={{ x: `${(-activeIndex * 100) / items.length}%` }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
        >
          {items.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={item.public_id}
                style={{ perspective: "800px" }}
              >
                <motion.div
                  className="w-[120px] sm:w-[180px] md:w-[200px] aspect-[3/4] flex flex-col items-center gap-2 will-change-[transform,scale]"
                  animate={{
                    rotateY: (activeIndex - i) * 60,
                    scale: isActive ? 1 : 0.85,
                  }}
                  transition={{ type: "spring", bounce: 0.1, duration: 1 }}
                >
                  {item.resource_type === "video" ? (
                    <div
                      className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => (isActive ? onSelect(i) : toSlide(i))}
                    >
                      <video
                        src={item.secure_url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border border-white/50 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/20">
                          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.secure_url}
                      alt=""
                      className="w-full h-full object-cover rounded-lg cursor-pointer"
                      loading="lazy"
                      draggable={false}
                      onClick={() => (isActive ? onSelect(i) : toSlide(i))}
                    />
                  )}

                  <motion.div
                    className="text-[10px] sm:text-xs whitespace-nowrap text-[--color-text-muted] tracking-wide will-change-[opacity,filter]"
                    animate={{
                      filter: isActive ? "blur(0px)" : "blur(2px)",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-4 justify-center mt-6 sm:mt-8 w-fit max-w-[90vw] mx-auto px-2 sm:px-3 py-1.5 rounded-full bg-[--color-surface]/50 backdrop-blur-sm border border-[--color-border]">
        <button onClick={toPrev} className="p-1.5 sm:p-2 cursor-pointer text-[--color-text-muted] hover:text-[--color-text] transition-colors shrink-0">
          <ChevronLeft size={16} />
        </button>

        <div className="max-w-[120px] sm:max-w-[180px] flex justify-center items-center gap-1 sm:gap-2 overflow-hidden flex-wrap">
          {items.map((_, i) => (
            <div
              key={i}
              onClick={() => toSlide(i)}
              className={`rounded-full cursor-pointer h-1.5 sm:h-2 transition-[width,background-color] duration-300 ${
                activeIndex === i
                  ? "w-5 sm:w-7 bg-[--color-text]"
                  : "w-1.5 sm:w-2 bg-[--color-text-muted]/30"
              }`}
            />
          ))}
        </div>

        <button onClick={toNext} className="p-1.5 sm:p-2 cursor-pointer text-[--color-text-muted] hover:text-[--color-text] transition-colors shrink-0">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

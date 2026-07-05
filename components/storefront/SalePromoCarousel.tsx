"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function SalePromoCarousel() {
  const [promos, setPromos] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/promotions?t=${timestamp}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.promotions.length > 0) {
          setPromos(data.promotions);
        }
      } catch (err) {
        console.error("Failed to fetch promos", err);
      }
    };
    fetchPromos();
  }, []);

  useEffect(() => {
    if (isPaused || promos.length === 0) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % promos.length;
        setDirection(nextIndex % 2 === 0 ? "right" : "left");
        return nextIndex;
      });
    }, 4200);

    return () => window.clearInterval(interval);
  }, [isPaused, promos.length]);

  if (promos.length === 0) return null;

  const currentPromo = promos[activeIndex];

  return (
    <div
      className="border-b border-brand-100/80 bg-gradient-to-r from-brand-50 via-white to-brand-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center rounded-full bg-brand-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-600 sm:text-[11px]">
            <Sparkles className="mr-1 h-3 w-3" />
            Sale
          </span>

          <div className="min-w-0 overflow-hidden">
            <div
              key={currentPromo.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs text-gray-700 sm:text-[15px] ${
                direction === "right" ? "animate-promo-enter-right" : "animate-promo-enter-left"
              }`}
              role="status"
              aria-live="polite"
            >
              <span className="font-semibold text-navy-900">{currentPromo.label}</span>
              <span className="truncate">{currentPromo.title}</span>
            </div>
          </div>
        </div>

        <Link
          href={currentPromo.href}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 sm:inline-flex"
        >
          View offers
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex justify-center gap-1.5 pb-2">
        {promos.map((promo, index) => (
          <button
            key={promo.id}
            type="button"
            aria-label={`Show ${promo.label}`}
            onClick={() => {
              setActiveIndex(index);
              setDirection(index % 2 === 0 ? "right" : "left");
            }}
            className={`h-2 w-2 rounded-full transition-all ${
              index === activeIndex ? "bg-brand-500" : "bg-brand-200"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes promo-enter-left {
          from {
            opacity: 0;
            transform: translateX(-18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes promo-enter-right {
          from {
            opacity: 0;
            transform: translateX(18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-promo-enter-left {
          animation: promo-enter-left 0.6s ease-out both;
        }

        .animate-promo-enter-right {
          animation: promo-enter-right 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}

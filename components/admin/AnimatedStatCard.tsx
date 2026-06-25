"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
  subtext?: string;
  formatAsCurrency?: boolean;
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef<number>(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (target === prevTarget.current) return;
    const start = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (target - start) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    prevTarget.current = target;

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return count;
}

export function AnimatedStatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  icon,
  iconBg,
  valueColor = "text-navy-900",
  subtext,
  formatAsCurrency = false,
}: AnimatedStatCardProps) {
  const displayValue = useCountUp(value);

  const formatted = formatAsCurrency
    ? `R ${displayValue.toLocaleString("en-ZA")}`
    : `${prefix}${displayValue.toLocaleString("en-ZA")}${suffix}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            {label}
          </p>
          <p className={`text-2xl font-extrabold ${valueColor} leading-tight`}>
            {formatted}
          </p>
          {subtext && (
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 ml-4 group-hover:scale-110 transition-transform duration-200`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

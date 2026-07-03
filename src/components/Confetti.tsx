"use client";

import { useMemo } from "react";
import config from "../../party.config";

export default function Confetti({ count = 80 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2.5 + Math.random() * 2,
        color:
          i % 3 === 0
            ? config.theme.primary
            : i % 3 === 1
              ? config.theme.secondary
              : "#ffffff",
        rotate: Math.random() * 360,
      })),
    [count]
  );

  return (
    <div aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: i % 2 === 0 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

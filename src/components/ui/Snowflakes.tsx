"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  opacity: number;
  size: number;
}

export default function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 18 + Math.random() * 25,
      animationDelay: Math.random() * 15,
      opacity: 0.4 + Math.random() * 0.4,
      size: 10 + Math.random() * 12,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(25px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-20px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(22px) rotate(270deg);
          }
          100% {
            transform: translateY(110vh) translateX(0) rotate(360deg);
          }
        }
        .snowflake {
          position: absolute;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 25px rgba(200, 220, 255, 0.5);
          animation: snowfall linear infinite;
          will-change: transform;
        }
      `}</style>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            opacity: flake.opacity,
            fontSize: `${flake.size}px`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

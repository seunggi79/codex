"use client";

import { useState } from "react";

type OrganicLogoMarkProps = {
  size?: number;
  className?: string;
};

export function OrganicLogoMark({ size = 26, className = "" }: OrganicLogoMarkProps) {
  const [glowX, setGlowX] = useState(28);
  const [glowY, setGlowY] = useState(24);
  const [tilt, setTilt] = useState(0);

  return (
    <div
      className={`relative overflow-hidden border border-white/35 bg-white/10 [border-radius:41%_59%_56%_44%_/_46%_36%_64%_54%] ${className}`}
      style={{ width: size, height: size, transform: `rotate(${tilt}deg)` }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setGlowX(x);
        setGlowY(y);
        setTilt((x - 50) * 0.08);
      }}
      onMouseLeave={() => {
        setGlowX(28);
        setGlowY(24);
        setTilt(0);
      }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.85), rgba(255,255,255,0.2) 42%, rgba(255,255,255,0.05) 74%)`,
        }}
      />
      <div className="absolute inset-[26%] rounded-full bg-black/20 blur-[1px]" />
    </div>
  );
}

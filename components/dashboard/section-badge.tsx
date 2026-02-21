"use client";

import Image from "next/image";

type SectionBadgeProps = {
  label: string;
};

export function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/45 bg-white/[0.16] px-3.5 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <Image
        src="/navbar_mark_png_pack/navbar_mark_mono_light_64.png"
        alt="Brand mark"
        width={15}
        height={15}
      />
      <p className="translate-y-px text-[11px] leading-none tracking-[0.14em] text-white">{label}</p>
    </div>
  );
}

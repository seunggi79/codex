"use client";

import Link from "next/link";
import { useMemo } from "react";
import { type AuthUser } from "@/lib/supabase/client";
import { OrganicLogoMark } from "@/components/ui/organic-logo-mark";
import { WaveBoxOverlay } from "@/components/ui/wave-box-overlay";

type DashboardNavbarProps = {
  user: AuthUser;
  onSignOut: () => Promise<void>;
};

export function DashboardNavbar({ user, onSignOut }: DashboardNavbarProps) {
  const profileInitial = (user.email?.trim().charAt(0) || "C").toUpperCase();
  const { initialX, initialY, initialRotate } = useMemo(
    () => ({
      initialX: 34 + Math.floor(Math.random() * 33),
      initialY: 36 + Math.floor(Math.random() * 29),
      initialRotate: -12 + Math.floor(Math.random() * 25),
    }),
    [],
  );

  return (
    <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
      <Link
        href="/"
        className="relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/[0.08] px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-white/[0.14]"
      >
        <WaveBoxOverlay className="opacity-90" />
        <span className="relative z-10 inline-flex items-center gap-2">
          <OrganicLogoMark size={26} />
          <span className="translate-y-px text-xs leading-none tracking-[0.18em] text-white/90 md:text-sm">THUMBNAIL AI</span>
        </span>
      </Link>

      <div className="group relative inline-flex">
        <button
          type="button"
          aria-haspopup="menu"
          className="relative inline-flex h-12 w-22 items-center justify-start gap-3 overflow-hidden rounded-full border border-white/35 bg-white/[0.08] px-3 py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-200 group-hover:h-[52px] group-hover:w-[168px] group-hover:border-white/55 group-hover:bg-white/[0.14] group-focus-within:h-[52px] group-focus-within:w-[168px] group-focus-within:border-white/55 group-focus-within:bg-white/[0.14]"
        >
          <div className="relative z-20 h-9 w-9 rotate-[-6deg] overflow-hidden border border-white/35 bg-white/10 [border-radius:42%_58%_61%_39%_/_44%_40%_60%_56%]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.75),rgba(255,255,255,0.15)_46%,rgba(255,255,255,0.06)_75%)]" />
            <span
              className="absolute z-10 text-[11px] font-semibold leading-none tracking-[0.08em] text-black/70"
              style={{
                left: `${initialX}%`,
                top: `${initialY}%`,
                transform: `translate(-50%, -50%) rotate(${initialRotate}deg)`,
              }}
            >
              {profileInitial}
            </span>
          </div>
          <span className="pointer-events-none absolute left-[54px] top-1/2 z-10 h-6 w-5 -translate-y-1/2 overflow-hidden rounded-full border border-white/35 bg-white/[0.16] shadow-[0_6px_16px_rgba(0,0,0,0.35)] transition-all duration-250 group-hover:h-7 group-hover:w-[104px] group-hover:border-white/95 group-hover:bg-white/[0.42] group-hover:shadow-[0_10px_24px_rgba(255,255,255,0.32)]">
            <WaveBoxOverlay className="opacity-80 transition-all duration-200 group-hover:opacity-100 group-hover:[filter:brightness(240%)_contrast(145%)]" />
          </span>
        </button>

        <div className="pointer-events-none absolute right-0 top-full z-20 w-44 translate-y-1 pt-2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <div className="rounded-2xl border border-white/25 bg-black/75 p-2 shadow-[0_14px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <button
              type="button"
              role="menuitem"
              onClick={onSignOut}
              className="inline-flex min-h-10 w-full items-center rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-left text-xs leading-none tracking-[0.14em] text-white transition hover:bg-white/[0.16]"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

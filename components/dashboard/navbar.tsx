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

      <div className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          className="peer group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/35 bg-white/[0.08] px-4 py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-white/[0.16]"
        >
          <div className="relative h-9 w-9 rotate-[-6deg] overflow-hidden border border-white/35 bg-white/10 [border-radius:42%_58%_61%_39%_/_44%_40%_60%_56%]">
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
          <span className="h-1.5 w-1.5 rounded-full bg-white transition group-hover:translate-x-1" />
        </button>

        <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-44 translate-y-1 opacity-0 transition duration-200 peer-hover:pointer-events-auto peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus-visible:pointer-events-auto peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100">
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

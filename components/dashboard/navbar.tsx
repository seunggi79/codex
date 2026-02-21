"use client";

import Image from "next/image";
import Link from "next/link";
import { type AuthUser } from "@/lib/supabase/client";

type DashboardNavbarProps = {
  user: AuthUser;
  onSignOut: () => Promise<void>;
};

export function DashboardNavbar({ user, onSignOut }: DashboardNavbarProps) {
  const profileInitial = (user.email?.trim().charAt(0) || "C").toUpperCase();

  return (
    <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/[0.08] px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-white/[0.14]"
      >
        <Image
          src="/navbar_mark_png_pack/navbar_mark_mono_light_64.png"
          alt="Brand mark"
          width={26}
          height={26}
          priority
        />
        <span className="translate-y-px text-xs leading-none tracking-[0.18em] text-white/90 md:text-sm">THUMBNAIL AI</span>
      </Link>

      <div className="group relative">
        <button
          type="button"
          aria-haspopup="menu"
          className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/30 bg-white/[0.08] px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-white/[0.14]"
        >
          <div className="relative h-9 w-9 rotate-[-6deg] overflow-hidden border border-white/35 bg-white/10 [border-radius:42%_58%_61%_39%_/_44%_40%_60%_56%]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.75),rgba(255,255,255,0.15)_46%,rgba(255,255,255,0.06)_75%)]" />
            <span className="relative z-10 flex h-full w-full items-center justify-center text-[11px] font-semibold tracking-[0.08em] text-black/70">
              {profileInitial}
            </span>
          </div>
          <span className="hidden max-w-[160px] truncate text-xs leading-none tracking-[0.12em] text-white/90 md:block">
            {user.email ?? "CREATOR"}
          </span>
        </button>

        <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-44 translate-y-1 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { Waves } from "@/components/ui/wave-background";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const callbackUrl = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/auth/callback`;
  }, []);

  const handleGoogleLogin = async () => {
    if (!callbackUrl) return;
    setAuthError(null);
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });

    if (error) {
      setAuthLoading(false);
      setAuthError(error.message);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, router, user]);

  const isBusy = loading || authLoading;

  return (
    <div className="min-h-screen w-full bg-black text-white">
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
          <span className="translate-y-px text-xs leading-none tracking-[0.18em] text-white/90 md:text-sm">
            THUMBNAIL AI
          </span>
        </Link>
      </nav>

      <section className="w-full px-4 pb-6 md:px-6 md:pb-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="h-px w-full bg-white/80" />
          <div className="relative mt-0 w-full overflow-hidden rounded-none md:rounded-sm" style={{ minHeight: "78vh" }}>
            <Waves className="h-full w-full" />
            <div className="absolute inset-0 bg-black/45" />

            <div className="relative z-10 flex min-h-[78vh] items-center px-6 md:px-12">
              <div className="relative w-full max-w-lg rounded-[30px] border border-white/30 bg-white/[0.08] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-6">
                <Link
                  href="/"
                  className="absolute right-5 top-5 inline-flex min-h-8 items-center gap-2 rounded-full border border-white/25 bg-white/[0.07] px-3 py-1.5 text-[11px] leading-none tracking-[0.12em] text-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition hover:bg-white/[0.14] hover:text-white md:right-6 md:top-7"
                >
                  <span aria-hidden>←</span>
                  BACK
                </Link>
                <div className="absolute left-5 top-[18px] inline-flex min-h-8 items-center gap-2 rounded-full border border-white/25 bg-white/[0.07] px-3 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] md:left-6 md:top-[26px]">
                  <Image
                    src="/navbar_mark_png_pack/navbar_mark_mono_light_64.png"
                    alt="Brand mark"
                    width={13}
                    height={13}
                  />
                  <p className="translate-y-px text-[11px] leading-none tracking-[0.14em] text-white/82">WELCOME</p>
                </div>
                <h1 className="mt-14 text-4xl font-semibold leading-[1.04] tracking-tight md:mt-16 md:text-5xl">
                  Google로 로그인
                </h1>
                <p className="mt-4 text-sm text-white/78 md:text-base">
                  Google 계정으로 로그인하면 바로 대시보드로 이동합니다.
                </p>
                {authError ? <p className="mt-4 text-sm text-red-300">{authError}</p> : null}

                <button
                  onClick={handleGoogleLogin}
                  disabled={isBusy}
                  className="group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/35 bg-white/[0.08] px-6 py-3.5 text-xs leading-none tracking-[0.14em] text-white shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-white/[0.16] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
                    G
                  </span>
                  {isBusy ? "LOADING..." : "CONTINUE WITH GOOGLE"}
                </button>

                {!loading && user ? (
                  <button
                    onClick={async () => {
                      await signOut();
                    }}
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-white/30 bg-white/[0.08] px-6 py-3 text-xs leading-none tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-white/[0.16]"
                  >
                    다른 계정으로 로그인
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-white/80" />
        </div>
      </section>
    </div>
  );
}

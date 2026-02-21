"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { PromptArea } from "@/components/dashboard/PromptArea";
import { Waves } from "@/components/ui/wave-background";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, router, user]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <p className="text-sm tracking-[0.14em] text-white/75">LOADING DASHBOARD...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <DashboardNavbar user={user} onSignOut={handleSignOut} />

      <section className="w-full px-4 pb-6 md:px-6 md:pb-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="h-px w-full bg-white/80" />
          <div className="relative overflow-hidden" style={{ minHeight: "78vh" }}>
            <Waves className="h-full w-full" />
            <div className="absolute inset-0 bg-black/35" />

            <div className="relative z-10 flex min-h-[78vh] items-center justify-center px-6 md:px-12">
              <div className="w-full max-w-4xl">
                <div className="mb-4 flex justify-center">
                  <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/45 bg-white/[0.16] px-3.5 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
                  <Image
                    src="/navbar_mark_png_pack/navbar_mark_mono_light_64.png"
                    alt="Brand mark"
                    width={15}
                    height={15}
                  />
                  <p className="translate-y-px text-[11px] leading-none tracking-[0.14em] text-white">DASHBOARD</p>
                </div>
                </div>
                <div className="mx-auto w-full max-w-3xl">
                  <PromptArea />
                </div>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-white/80" />
        </div>
      </section>
    </div>
  );
}

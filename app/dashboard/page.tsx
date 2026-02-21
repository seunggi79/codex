"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
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

            <div className="relative z-10 flex min-h-[78vh] items-center px-6 md:px-12">
              <div className="w-full max-w-3xl rounded-2xl border border-white/20 bg-white/[0.06] p-6 backdrop-blur-md md:p-8">
                <p className="text-xs tracking-[0.14em] text-white/75">DASHBOARD</p>
                <h1 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-tight md:text-6xl">
                  반가워요,
                  <br />
                  {user.email ?? "Creator"}
                </h1>
                <p className="mt-4 max-w-xl text-sm text-white/80 md:text-base">
                  여기서 프로젝트를 시작하고, 생성한 썸네일 시안을 관리할 수 있습니다.
                </p>

                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  <button className="rounded-xl border border-white/30 bg-white/[0.1] px-4 py-4 text-left text-sm text-white transition hover:bg-white/[0.18]">
                    새 썸네일 만들기
                  </button>
                  <Link
                    href="/"
                    className="rounded-xl border border-white/20 bg-black/30 px-4 py-4 text-left text-sm text-white/85 transition hover:bg-black/45"
                  >
                    랜딩 페이지 보기
                  </Link>
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

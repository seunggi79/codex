"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Waves } from "@/components/ui/wave-background";

type WavesDemoProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function WavesDemo({ ctaHref = "/auth", ctaLabel = "GET STARTED" }: WavesDemoProps) {
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
          <span className="translate-y-px text-xs leading-none tracking-[0.18em] text-white/90 md:text-sm">THUMBNAIL AI</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] px-4 py-2.5 text-xs leading-none tracking-[0.12em] text-white/88 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-white/[0.14]"
          >
            Features
          </a>
          <a
            href="#"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] px-4 py-2.5 text-xs leading-none tracking-[0.12em] text-white/88 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-white/[0.14]"
          >
            Pricing
          </a>
          <a
            href="#"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] px-4 py-2.5 text-xs leading-none tracking-[0.12em] text-white/88 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-white/[0.14]"
          >
            Contact
          </a>
        </div>
      </nav>

      <section className="w-full px-4 pb-6 md:px-6 md:pb-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="h-px w-full bg-white/80" />
          <div className="relative mt-0 w-full overflow-hidden rounded-none md:rounded-sm" style={{ minHeight: "78vh" }}>
            <Waves className="h-full w-full" />
            <div className="pointer-events-none absolute inset-0 flex items-center">
              <div className="px-6 md:px-12">
                <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
                  AI가 만드는
                  <br />
                  유튜브 썸네일
                </h1>
                <p className="mt-5 max-w-xl text-base text-white/78 md:text-lg">
                  아이디어 입력만으로 고클릭 썸네일 시안을 빠르게 생성합니다.
                </p>
              </div>
            </div>

            <div className="absolute bottom-8 left-6 right-6 md:bottom-12 md:left-12 md:right-auto">
              <Link
                href={ctaHref}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-white/35 bg-white/[0.08] px-6 py-3.5 text-xs leading-none tracking-[0.14em] text-white shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-white/[0.16]"
              >
                {ctaLabel}
                <span className="h-1.5 w-1.5 rounded-full bg-white transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="h-px w-full bg-white/80" />
        </div>
      </section>
    </div>
  );
}

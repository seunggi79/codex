"use client";

import Image from "next/image";
import * as React from "react";
import { Waves } from "@/components/ui/wave-background";

export function WavesDemo() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/navbar_mark_png_pack/navbar_mark_mono_light_64.png"
            alt="Brand mark"
            width={28}
            height={28}
            priority
          />
          <span className="text-sm tracking-[0.18em] text-white/85">THUMBNAIL AI</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm text-white/75 transition-colors hover:text-white">
            Features
          </a>
          <a href="#" className="text-sm text-white/75 transition-colors hover:text-white">
            Pricing
          </a>
          <a href="#" className="text-sm text-white/75 transition-colors hover:text-white">
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
              <button className="group flex items-center gap-3 rounded-full border border-white/40 bg-white/[0.06] px-6 py-3 text-xs tracking-[0.14em] text-white backdrop-blur-sm transition hover:bg-white/15">
                GET STARTED
                <span className="h-1.5 w-1.5 rounded-full bg-white transition group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          <div className="h-px w-full bg-white/80" />
        </div>
      </section>
    </div>
  );
}

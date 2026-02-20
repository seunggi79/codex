import Image from "next/image";
import Link from "next/link";
import { Waves } from "@/components/ui/wave-background";

export default function AuthPage() {
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
      </nav>

      <section className="w-full px-4 pb-6 md:px-6 md:pb-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="h-px w-full bg-white/80" />
          <div className="relative mt-0 w-full overflow-hidden rounded-none md:rounded-sm" style={{ minHeight: "78vh" }}>
            <Waves className="h-full w-full" />
            <div className="absolute inset-0 bg-black/45" />

            <div className="relative z-10 flex min-h-[78vh] items-center px-6 md:px-12">
              <div className="relative w-full max-w-lg rounded-2xl border border-white/25 bg-white/[0.06] p-6 backdrop-blur-md md:p-8">
                <Link
                  href="/"
                  className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-3 py-1.5 text-[11px] tracking-[0.12em] text-white/80 transition hover:bg-white/[0.1] hover:text-white md:right-8 md:top-8"
                >
                  <span aria-hidden>←</span>
                  BACK
                </Link>
                <p className="text-xs tracking-[0.14em] text-white/70">WELCOME</p>
                <h1 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-tight md:text-5xl">
                  Google로
                  <br />
                  빠르게 시작하세요
                </h1>
                <p className="mt-4 text-sm text-white/78 md:text-base">
                  로그인과 회원가입은 자동으로 처리됩니다. Google 계정 하나로 바로 이용할 수 있습니다.
                </p>

                <button className="group mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-white/40 bg-white/[0.08] px-6 py-3 text-xs tracking-[0.14em] text-white transition hover:bg-white/18">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
                    G
                  </span>
                  CONTINUE WITH GOOGLE
                </button>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-white/80" />
        </div>
      </section>
    </div>
  );
}

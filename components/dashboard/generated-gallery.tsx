"use client";

import Image from "next/image";

type GeneratedGalleryProps = {
  images: string[];
};

export function GeneratedGallery({ images }: GeneratedGalleryProps) {
  return (
    <section className="w-full px-4 pb-10 md:px-6 md:pb-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 inline-flex min-h-10 items-center rounded-full border border-white/30 bg-white/[0.08] px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
          <Image
            src="/navbar_mark_png_pack/navbar_mark_mono_light_64.png"
            alt="Brand mark"
            width={15}
            height={15}
            className="mr-2"
          />
          <p className="text-[11px] leading-none tracking-[0.14em] text-white/90">GENERATED GALLERY</p>
        </div>

        <div className="rounded-[24px] border border-white/20 bg-white/[0.04] px-5 py-8 backdrop-blur-sm">
          {images.length === 0 ? (
            <p className="text-center text-sm text-white/65">아직 생성된 이미지가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((imageDataUrl, index) => (
                <div
                  key={`${imageDataUrl.slice(0, 24)}-${index}`}
                  className="overflow-hidden rounded-[20px] bg-gradient-to-br from-white/[0.2] via-white/[0.11] to-white/[0.06] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.38)]"
                >
                  <img
                    src={imageDataUrl}
                    alt={`Generated gallery item ${index + 1}`}
                    className="h-full w-full rounded-[16px] object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

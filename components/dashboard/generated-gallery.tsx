"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryItem } from "@/lib/supabase/thumbnails";

type GeneratedGalleryProps = {
  items: GalleryItem[];
  onDelete: (item: GalleryItem) => Promise<void> | void;
};

export function GeneratedGallery({ items, onDelete }: GeneratedGalleryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  return (
    <>
      {selectedImageUrl ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close image modal"
            onClick={() => setSelectedImageUrl(null)}
          />
          <div className="relative z-10 max-h-[92vh] max-w-[92vw] overflow-hidden rounded-[24px] bg-white/[0.08] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
            <img src={selectedImageUrl} alt="Expanded generated thumbnail" className="max-h-[88vh] max-w-[88vw] rounded-[18px] object-contain" />
            <button
              type="button"
              onClick={() => setSelectedImageUrl(null)}
              className="absolute right-4 top-4 rounded-full border border-white/50 bg-black/55 px-3 py-1 text-xs tracking-[0.12em] text-white hover:bg-black/80"
            >
              CLOSE
            </button>
          </div>
        </div>
      ) : null}

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
            {items.length === 0 ? (
              <p className="text-center text-sm text-white/65">아직 생성된 이미지가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-white/[0.2] via-white/[0.11] to-white/[0.06] p-1.5 text-left shadow-[0_12px_30px_rgba(0,0,0,0.38)]"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedImageUrl(item.imageUrl)}
                      className="block w-full"
                    >
                      <img
                        src={item.imageUrl}
                        alt={`Generated gallery item ${index + 1}`}
                        className="h-full w-full rounded-[16px] object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={async (event) => {
                        event.stopPropagation();
                        if (deletingId) return;
                        try {
                          setDeletingId(item.id);
                          await onDelete(item);
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className="absolute right-3 top-3 z-10 rounded-full border border-white/45 bg-black/55 px-3 py-1 text-[10px] tracking-[0.12em] text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-65"
                      disabled={Boolean(deletingId)}
                    >
                      {deletingId === item.id ? "..." : "DELETE"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

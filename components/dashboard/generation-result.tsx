"use client";

import { LoadRipple } from "@/components/ui/load-ripple";

type GenerationResultProps = {
  isGenerating: boolean;
  error: string | null;
  imageDataUrl: string | null;
  text: string;
};

export function GenerationResult({ isGenerating, error, imageDataUrl, text }: GenerationResultProps) {
  return (
    <>
      {isGenerating ? (
        <div className="flex flex-col items-center">
          <LoadRipple />
          <p className="mt-2 text-center text-xs tracking-[0.12em] text-white/75">GENERATING IMAGE...</p>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-center text-sm text-red-300">{error}</p> : null}

      {imageDataUrl ? (
        <div className="mt-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-white/[0.22] via-white/[0.12] to-white/[0.06] p-2 shadow-[0_16px_44px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <img src={imageDataUrl} alt="Generated thumbnail" className="w-full rounded-[18px] object-cover" />
        </div>
      ) : null}

      {!error && text ? <p className="mt-4 whitespace-pre-line text-sm text-white/80">{text}</p> : null}
    </>
  );
}

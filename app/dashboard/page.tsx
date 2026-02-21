"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { PromptArea, type PromptAreaPayload } from "@/components/dashboard/PromptArea";
import { Waves } from "@/components/ui/wave-background";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [generatedImageDataUrl, setGeneratedImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, router, user]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const handleGenerateImage = async (payload: PromptAreaPayload) => {
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedText("");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: payload.prompt,
          images: payload.images,
          useSearch: payload.useSearch,
          aspectRatio: "16:9",
          imageSize: "1K",
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        detail?: string;
        hint?: string;
        text?: string;
        images?: Array<{ dataUrl: string }>;
      };

      if (!response.ok) {
        const hint = result.hint ? `\n${result.hint}` : "";
        const detail = result.detail ? `\n${result.detail}` : "";
        throw new Error((result.error || "Image generation failed.") + hint + detail);
      }

      setGeneratedText(result.text ?? "");
      setGeneratedImageDataUrl(result.images?.[0]?.dataUrl ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "이미지 생성 중 오류가 발생했습니다.";
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
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
                  <PromptArea onGenerate={handleGenerateImage} loading={isGenerating} />

                  {isGenerating ? (
                    <p className="mt-4 text-center text-xs tracking-[0.12em] text-white/75">GENERATING IMAGE...</p>
                  ) : null}

                  {generationError ? (
                    <p className="mt-4 text-center text-sm text-red-300">{generationError}</p>
                  ) : null}

                  {generatedImageDataUrl ? (
                    <div className="mt-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-white/[0.22] via-white/[0.12] to-white/[0.06] p-2 shadow-[0_16px_44px_rgba(0,0,0,0.45)] backdrop-blur-md">
                      <img src={generatedImageDataUrl} alt="Generated thumbnail" className="w-full rounded-[18px] object-cover" />
                    </div>
                  ) : null}

                  {!generationError && generatedText ? (
                    <p className="mt-4 whitespace-pre-line text-sm text-white/80">{generatedText}</p>
                  ) : null}
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

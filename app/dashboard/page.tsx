"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { PromptArea, type PromptAreaPayload } from "@/components/dashboard/PromptArea";
import { SectionBadge } from "@/components/dashboard/section-badge";
import { GenerationResult } from "@/components/dashboard/generation-result";
import { GeneratedGallery } from "@/components/dashboard/generated-gallery";
import { Waves } from "@/components/ui/wave-background";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchGalleryThumbnails,
  persistGeneratedThumbnail,
  createSignedThumbnailUrl,
  deleteGalleryThumbnail,
  type GalleryItem,
} from "@/lib/supabase/thumbnails";

export default function DashboardPage() {
  const router = useRouter();
  const { user, session, loading, signOut } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [generatedImageDataUrl, setGeneratedImageDataUrl] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  useEffect(() => {
    if (!session?.access_token || !user?.id) return;
    let canceled = false;

    const loadGallery = async () => {
      setIsGalleryLoading(true);
      try {
        const items = await fetchGalleryThumbnails(session.access_token, 24);
        if (!canceled) {
          setGalleryImages(items);
        }
      } catch {
        if (!canceled) {
          setGalleryImages([]);
        }
      } finally {
        if (!canceled) {
          setIsGalleryLoading(false);
        }
      }
    };

    void loadGallery();
    return () => {
      canceled = true;
    };
  }, [session?.access_token, user?.id]);

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
    setGeneratedImageDataUrl(null);

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
      const nextImageDataUrl = result.images?.[0]?.dataUrl ?? null;
      setGeneratedImageDataUrl(nextImageDataUrl);
      if (nextImageDataUrl && session?.access_token && user?.id) {
        try {
          const saved = await persistGeneratedThumbnail({
            accessToken: session.access_token,
            userId: user.id,
            prompt: payload.prompt,
            imageDataUrl: nextImageDataUrl,
          });
          const signedUrl = await createSignedThumbnailUrl(session.access_token, saved.storagePath);
          setGalleryImages((prev) => [{ id: saved.id, imageUrl: signedUrl, storagePath: saved.storagePath }, ...prev].slice(0, 24));
        } catch {
          setGalleryImages((prev) => [{ id: `local-${Date.now()}-${Math.random()}`, imageUrl: nextImageDataUrl }, ...prev].slice(0, 24));
        }
      } else if (nextImageDataUrl) {
        setGalleryImages((prev) => [{ id: `local-${Date.now()}-${Math.random()}`, imageUrl: nextImageDataUrl }, ...prev].slice(0, 24));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "이미지 생성 중 오류가 발생했습니다.";
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteGalleryItem = async (item: GalleryItem) => {
    setGalleryImages((prev) => prev.filter((candidate) => candidate.id !== item.id));
    if (!session?.access_token) return;
    if (item.id.startsWith("local-")) return;

    try {
      await deleteGalleryThumbnail({
        accessToken: session.access_token,
        id: item.id,
        storagePath: item.storagePath,
      });
    } catch {
      setGalleryImages((prev) => [item, ...prev]);
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
                  <SectionBadge label="DASHBOARD" />
                </div>
                <div className="mx-auto w-full max-w-3xl">
                  <PromptArea onGenerate={handleGenerateImage} loading={isGenerating} />
                  <GenerationResult
                    isGenerating={isGenerating}
                    error={generationError}
                    imageDataUrl={generatedImageDataUrl}
                    text={generatedText}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-white/80" />
        </div>
      </section>

      <GeneratedGallery items={galleryImages} onDelete={handleDeleteGalleryItem} isLoading={isGalleryLoading} />
    </div>
  );
}

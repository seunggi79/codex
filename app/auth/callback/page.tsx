"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const callbackError =
        searchParams.get("error_description") ?? searchParams.get("error");
      if (callbackError) {
        setError(callbackError);
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession("");

      if (exchangeError) {
        setError(exchangeError.message);
        return;
      }

      router.replace("/dashboard");
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="text-center">
        <p className="text-sm tracking-[0.14em] text-white/70">AUTHENTICATION</p>
        <h1 className="mt-3 text-2xl font-semibold">로그인 처리 중...</h1>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>
    </main>
  );
}

"use client";

import { WavesDemo } from "@/components/main/wave";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return <WavesDemo ctaHref={user ? "/dashboard" : "/auth"} ctaLabel={user ? "GO TO DASHBOARD" : "GET STARTED"} />;
}

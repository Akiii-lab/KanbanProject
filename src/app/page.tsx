"use client";

import { HeroComponent } from "@/components/HeroComponent/hero";
import { useGlobalStore } from "@/store/globalStore";
import { useEffect } from "react";

export default function Home() {
  const { setGlobalLoading } = useGlobalStore();

  useEffect(() => {
    setGlobalLoading(false);
  }, [setGlobalLoading]);

  return (
    <div>
      <HeroComponent />
    </div>
  );
}

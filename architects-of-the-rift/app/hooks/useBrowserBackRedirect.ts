"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useBrowserBackRedirect(targetPath: string) {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      router.replace(targetPath);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, targetPath]);
}
"use client";

import { useState, useEffect } from "react";

export type ViewportType = "mobile" | "desktop";

const MOBILE_BREAKPOINT = 768;

export function useViewport(): ViewportType {
  const [viewport, setViewport] = useState<ViewportType>("desktop");

  useEffect(() => {
    const checkViewport = () => {
      setViewport(window.innerWidth < MOBILE_BREAKPOINT ? "mobile" : "desktop");
    };

    // Check on mount
    checkViewport();

    // Listen for resize
    window.addEventListener("resize", checkViewport);

    return () => {
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  return viewport;
}

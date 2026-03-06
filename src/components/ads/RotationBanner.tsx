"use client";

import { useEffect, useRef } from "react";

export function RotationBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement("script");
    script.src =
      "//rot3.a8.net/jsa/d1a1c654607455045169ae634c29e9e2/c6f057b86584942e415435ffb1fa93d4.js";
    script.type = "text/javascript";
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center min-h-[250px] rounded-2xl overflow-hidden"
    />
  );
}

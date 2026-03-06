"use client";

import { useEffect, useRef, useState } from "react";

export function RotationBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || loaded) return;

    // document.write を一時的にオーバーライドして、
    // 出力先を containerRef に差し替える
    const originalWrite = document.write.bind(document);
    const buffer: string[] = [];

    document.write = (content: string) => {
      buffer.push(content);
    };

    const script = document.createElement("script");
    script.src =
      "//rot3.a8.net/jsa/d1a1c654607455045169ae634c29e9e2/c6f057b86584942e415435ffb1fa93d4.js";
    script.type = "text/javascript";

    script.onload = () => {
      // バッファに溜まった内容をコンテナに挿入
      if (containerRef.current && buffer.length > 0) {
        containerRef.current.innerHTML = buffer.join("");
        // 挿入したHTML内のscriptタグも実行
        const scripts = containerRef.current.querySelectorAll("script");
        scripts.forEach((s) => {
          const newScript = document.createElement("script");
          if (s.src) {
            newScript.src = s.src;
          } else {
            newScript.textContent = s.textContent;
          }
          s.parentNode?.replaceChild(newScript, s);
        });
      }
      document.write = originalWrite;
      setLoaded(true);
    };

    script.onerror = () => {
      document.write = originalWrite;
    };

    containerRef.current.appendChild(script);

    return () => {
      document.write = originalWrite;
    };
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center min-h-[250px] rounded-2xl overflow-hidden"
    />
  );
}

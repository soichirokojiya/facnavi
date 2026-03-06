"use client";

import { useEffect, useRef } from "react";

export function RotationBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100%;}</style></head>
      <body>
        <script type="text/javascript" src="//rot3.a8.net/jsa/d1a1c654607455045169ae634c29e9e2/c6f057b86584942e415435ffb1fa93d4.js"></script>
      </body>
      </html>
    `);
    doc.close();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="rounded-2xl overflow-hidden border-0"
      width="300"
      height="250"
      scrolling="no"
      title="PR"
    />
  );
}

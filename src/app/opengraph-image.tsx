import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ファクナビ - ファクタリング会社の口コミ・比較ランキング";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #4caf50 0%, #1e40af 100%)",
          }}
        />

        {/* Main card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 64px",
          }}
        >
          {/* Logo icon + text */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
            {/* Logo icon SVG inline */}
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              <path
                d="M70 15.4A42 42 0 1 0 70 84.6"
                stroke="#333333"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M55 8.7A46 46 0 0 1 82 30"
                stroke="#4caf50"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <path
                d="M82 70A46 46 0 0 1 55 91.3"
                stroke="#4caf50"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <line x1="28" y1="42" x2="72" y2="42" stroke="#4caf50" strokeWidth="8" strokeLinecap="round" />
              <line x1="28" y1="58" x2="72" y2="58" stroke="#333333" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: 80, fontWeight: 800, color: "#1f2937", letterSpacing: -2 }}>ファク</span>
              <span style={{ fontSize: 80, fontWeight: 800, color: "#4caf50", letterSpacing: -2 }}>ナビ</span>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#1f2937",
              textAlign: "center",
              lineHeight: 1.4,
              marginBottom: 16,
            }}
          >
            ファクタリング会社の口コミ・比較ランキング
          </div>

          {/* Sub text */}
          <div
            style={{
              fontSize: 22,
              color: "#64748b",
              textAlign: "center",
              lineHeight: 1.5,
              marginBottom: 32,
            }}
          >
            255社の手数料・スピード・口コミを徹底比較
          </div>

          {/* Badge row */}
          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                background: "#4caf50",
                color: "white",
                padding: "10px 28px",
                borderRadius: 50,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              日本最大級
            </div>
            <div
              style={{
                border: "2px solid #1e40af",
                color: "#1e40af",
                padding: "10px 28px",
                borderRadius: 50,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              無料で比較
            </div>
            <div
              style={{
                border: "2px solid #f59e0b",
                color: "#f59e0b",
                padding: "10px 28px",
                borderRadius: 50,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              口コミ掲載
            </div>
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 40,
            color: "#94a3b8",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          facnavi.info
        </div>
      </div>
    ),
    { ...size }
  );
}

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
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.08,
            display: "flex",
            flexWrap: "wrap",
            fontSize: 60,
            lineHeight: 1,
            gap: 40,
            padding: 40,
          }}
        >
          {"💰📊✅💰📊✅💰📊✅💰📊✅💰📊✅💰📊✅💰📊✅💰📊✅"}
        </div>

        {/* White card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            borderRadius: 24,
            padding: "48px 64px",
            maxWidth: 1000,
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          }}
        >
          {/* Logo text */}
          <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: "#1f2937" }}>ファク</span>
            <span style={{ fontSize: 72, fontWeight: 700, color: "#43a047" }}>ナビ</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#1f2937",
              textAlign: "center",
              lineHeight: 1.4,
              marginBottom: 20,
            }}
          >
            ファクタリング会社の口コミ・比較ランキング
          </div>

          {/* Sub text */}
          <div
            style={{
              fontSize: 20,
              color: "#6b7280",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            254社の手数料・スピード・口コミを徹底比較
          </div>

          {/* Badge row */}
          <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
            <div
              style={{
                background: "#43a047",
                color: "white",
                padding: "8px 24px",
                borderRadius: 50,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              日本最大級
            </div>
            <div
              style={{
                background: "#1e40af",
                color: "white",
                padding: "8px 24px",
                borderRadius: 50,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              無料で比較
            </div>
            <div
              style={{
                background: "#f59e0b",
                color: "white",
                padding: "8px 24px",
                borderRadius: 50,
                fontSize: 18,
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
            bottom: 28,
            right: 40,
            color: "rgba(255,255,255,0.7)",
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          facnavi.info
        </div>
      </div>
    ),
    { ...size }
  );
}

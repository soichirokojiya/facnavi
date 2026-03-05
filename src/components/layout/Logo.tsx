interface LogoProps {
  size?: "sm" | "md" | "lg";
  white?: boolean;
}

const styles = {
  sm: { text: "text-xl", bar: "h-[3px] mt-0.5", icon: 30 },
  md: { text: "text-2xl", bar: "h-[3px] mt-1", icon: 38 },
  lg: { text: "text-4xl md:text-5xl", bar: "h-1 mt-1.5", icon: 56 },
};

export function LogoIcon({ size = 30, white = false }: { size?: number; white?: boolean }) {
  const bg = white ? "rgba(255,255,255,0.15)" : "#eff6ff";
  const doc = white ? "#ffffff" : "#1e40af";
  const line = white ? "rgba(30,64,175,0.9)" : "#ffffff";
  const arrow = "#f59e0b";

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill={bg} />
      {/* Document */}
      <rect x="9" y="8" width="16" height="21" rx="2.5" fill={doc} />
      <rect x="13" y="13" width="8" height="2" rx="1" fill={line} opacity="0.9" />
      <rect x="13" y="17.5" width="6" height="2" rx="1" fill={line} opacity="0.7" />
      <rect x="13" y="22" width="9" height="2" rx="1" fill={line} opacity="0.5" />
      {/* Arrow */}
      <path d="M22 16L31 20L22 24" stroke={arrow} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="18" y1="20" x2="29" y2="20" stroke={arrow} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = "md", white = false }: LogoProps) {
  const s = styles[size];

  return (
    <span className="inline-flex items-center gap-2">
      <LogoIcon size={s.icon} white={white} />
      <span className="inline-block">
        <span className={`${s.text} font-extrabold tracking-tight leading-none`}>
          <span className={white ? "text-white" : "text-primary"}>ファク</span>
          <span className="text-accent">ナビ</span>
        </span>
        <span className={`block rounded-full bg-gradient-to-r from-accent to-amber-400 ${s.bar}`} />
      </span>
    </span>
  );
}

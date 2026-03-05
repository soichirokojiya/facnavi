interface LogoProps {
  size?: "sm" | "md" | "lg";
  white?: boolean;
}

const styles = {
  sm: { text: "text-xl", icon: 28 },
  md: { text: "text-2xl", icon: 36 },
  lg: { text: "text-4xl md:text-5xl", icon: 52 },
};

export function LogoIcon({ size = 36, white = false }: { size?: number; white?: boolean }) {
  const dark = white ? "#ffffff" : "#333333";
  const green = "#4caf50";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer dark circle (open on right) */}
      <path
        d="M70 15.4A42 42 0 1 0 70 84.6"
        stroke={dark}
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Green arc (right side) */}
      <path
        d="M55 8.7A46 46 0 0 1 82 30"
        stroke={green}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M82 70A46 46 0 0 1 55 91.3"
        stroke={green}
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Horizontal lines through center */}
      <line x1="28" y1="42" x2="72" y2="42" stroke={green} strokeWidth="8" strokeLinecap="round" />
      <line x1="28" y1="58" x2="72" y2="58" stroke={dark} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = "md", white = false }: LogoProps) {
  const s = styles[size];

  return (
    <span className="inline-flex items-center gap-2">
      <LogoIcon size={s.icon} white={white} />
      <span className={`${s.text} font-extrabold tracking-tight leading-none`}>
        <span className={white ? "text-white" : "text-gray-800"}>ファク</span>
        <span className="text-[#4caf50]">ナビ</span>
      </span>
    </span>
  );
}

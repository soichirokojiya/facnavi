const categoryStyles: Record<string, { gradient: string; icon: string; label: string }> = {
  基礎知識: {
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
    icon: "📘",
    label: "基礎知識",
  },
  選び方: {
    gradient: "from-emerald-600 via-emerald-500 to-teal-400",
    icon: "🔍",
    label: "選び方ガイド",
  },
  業種別: {
    gradient: "from-amber-600 via-amber-500 to-orange-400",
    icon: "🏢",
    label: "業種別ガイド",
  },
  比較: {
    gradient: "from-purple-600 via-purple-500 to-pink-400",
    icon: "⚖️",
    label: "徹底比較",
  },
};

const defaultStyle = {
  gradient: "from-gray-600 via-gray-500 to-gray-400",
  icon: "📄",
  label: "コラム",
};

interface ArticleEyecatchProps {
  category: string;
  title: string;
  size?: "sm" | "lg";
}

export function ArticleEyecatch({ category, title, size = "sm" }: ArticleEyecatchProps) {
  const style = categoryStyles[category] ?? defaultStyle;
  const isLarge = size === "lg";

  return (
    <div
      className={`relative bg-gradient-to-br ${style.gradient} rounded-lg overflow-hidden ${
        isLarge ? "h-56 md:h-72" : "h-40"
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-6 -top-6 text-[120px] leading-none select-none">
          {style.icon}
        </div>
        <div className="absolute -left-4 -bottom-4 text-[80px] leading-none select-none rotate-12">
          {style.icon}
        </div>
      </div>

      {/* Content */}
      <div className={`relative h-full flex flex-col justify-end ${
        isLarge ? "p-6 md:p-8" : "p-4"
      }`}>
        <span className={`inline-block bg-white/20 backdrop-blur-sm text-white font-bold rounded-full mb-2 ${
          isLarge ? "text-sm px-4 py-1" : "text-[11px] px-3 py-0.5 w-fit"
        }`}>
          {style.label}
        </span>
        <p className={`font-bold text-white leading-snug ${
          isLarge
            ? "text-xl md:text-2xl line-clamp-3"
            : "text-sm line-clamp-2"
        }`}>
          {title}
        </p>
      </div>
    </div>
  );
}

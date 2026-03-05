const categoryStyles: Record<string, { gradient: string; emoji: string }> = {
  基礎知識: { gradient: "from-blue-500 to-cyan-400", emoji: "📘" },
  選び方: { gradient: "from-emerald-500 to-teal-400", emoji: "🔍" },
  業種別: { gradient: "from-amber-500 to-orange-400", emoji: "🏢" },
  比較: { gradient: "from-purple-500 to-pink-400", emoji: "⚖️" },
};

const defaultStyle = { gradient: "from-gray-500 to-gray-400", emoji: "📄" };

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
      className={`bg-gradient-to-br ${style.gradient} rounded-lg flex flex-col items-center justify-center text-white ${
        isLarge ? "h-48 md:h-64 px-8" : "h-36 px-4"
      }`}
    >
      <span className={isLarge ? "text-5xl mb-3" : "text-3xl mb-2"}>{style.emoji}</span>
      <p
        className={`font-bold text-center leading-snug ${
          isLarge ? "text-lg md:text-xl line-clamp-3" : "text-xs line-clamp-2"
        }`}
      >
        {title}
      </p>
    </div>
  );
}

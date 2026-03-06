import Image from "next/image";

const categoryStyles: Record<string, { gradient: string; icon: string; label: string }> = {
  基礎知識: {
    gradient: "from-blue-900/80 via-blue-800/70 to-blue-700/60",
    icon: "📘",
    label: "基礎知識",
  },
  選び方: {
    gradient: "from-emerald-900/80 via-emerald-800/70 to-emerald-700/60",
    icon: "🔍",
    label: "選び方ガイド",
  },
  業種別: {
    gradient: "from-amber-900/80 via-amber-800/70 to-amber-700/60",
    icon: "🏢",
    label: "業種別ガイド",
  },
  比較: {
    gradient: "from-purple-900/80 via-purple-800/70 to-purple-700/60",
    icon: "⚖️",
    label: "徹底比較",
  },
};

const defaultStyle = {
  gradient: "from-gray-900/80 via-gray-800/70 to-gray-700/60",
  icon: "📄",
  label: "実践経営ノート",
};

interface ArticleEyecatchProps {
  category: string;
  title: string;
  image?: string;
  size?: "sm" | "lg";
}

export function ArticleEyecatch({ category, title, image, size = "sm" }: ArticleEyecatchProps) {
  const style = categoryStyles[category] ?? defaultStyle;
  const isLarge = size === "lg";

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${
        isLarge ? "h-56 md:h-72" : "h-48"
      }`}
    >
      {/* Background image or gradient */}
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes={isLarge ? "768px" : "400px"}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient.replace(/\/\d+/g, "")}`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-6 -top-6 text-[120px] leading-none select-none">
              {style.icon}
            </div>
            <div className="absolute -left-4 -bottom-4 text-[80px] leading-none select-none rotate-12">
              {style.icon}
            </div>
          </div>
        </div>
      )}

      {/* Dark overlay for text readability */}
      <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient}`} />

      {/* Content */}
      <div className={`relative h-full flex flex-col justify-end ${
        isLarge ? "p-6 md:p-8" : "p-4"
      }`}>
        <span className={`inline-block bg-white/20 backdrop-blur-sm text-white font-bold rounded-full mb-2 ${
          isLarge ? "text-sm px-4 py-1" : "text-xs px-3 py-0.5 w-fit"
        }`}>
          {style.label}
        </span>
        <p className={`font-bold text-white leading-snug drop-shadow-md ${
          isLarge
            ? "text-2xl md:text-3xl line-clamp-3"
            : "text-lg line-clamp-2"
        }`}>
          {title}
        </p>
      </div>
    </div>
  );
}

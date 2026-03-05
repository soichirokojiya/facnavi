interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  let h2Index = 0;

  return (
    <nav className="bg-white rounded-xl p-6 mb-10 border-2 border-primary/20 shadow-sm">
      <h2 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
        <span className="inline-block w-6 h-6 bg-primary text-white text-xs font-bold rounded flex items-center justify-center">目</span>
        この記事の目次
      </h2>
      <ol className="space-y-2 text-[15px]">
        {headings.map((h) => {
          if (h.level === 2) h2Index++;
          return (
            <li
              key={h.id}
              className={h.level === 3 ? "ml-6 text-sm" : ""}
            >
              <a
                href={`#${h.id}`}
                className="text-gray-700 hover:text-primary hover:underline transition-colors flex items-start gap-2"
              >
                {h.level === 2 && (
                  <span className="text-primary font-bold shrink-0">{h2Index}.</span>
                )}
                {h.level === 3 && (
                  <span className="text-gray-400 shrink-0">─</span>
                )}
                <span>{h.text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

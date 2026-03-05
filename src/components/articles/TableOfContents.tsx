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

  return (
    <nav className="bg-gray-50 rounded-lg p-5 mb-8 border border-gray-200">
      <h2 className="font-bold text-sm text-gray-700 mb-3">目次</h2>
      <ol className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li
            key={h.id}
            className={h.level === 3 ? "ml-4" : ""}
          >
            <a
              href={`#${h.id}`}
              className="text-primary hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
